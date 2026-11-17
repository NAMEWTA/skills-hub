import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

// 仅检查原型中的状态逻辑。这里没有浏览器、DOM 布局、原生 dialog 或视觉检查。
// 使用最小的显示适配器和可控计时器运行 HTML 内原有处理函数，绝不调用外部服务。
const html = readFileSync(new URL('../prototype/index.html', import.meta.url), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
assert.ok(script, '找到内嵌脚本');
new vm.Script(script, {filename:'prototype/index.html'});

const elements=new Map();
const timers=new Map();
let timerId=0;
class DisplayAdapter {
  constructor(id){this.id=id;this.value='';this.disabled=false;this.hidden=false;this.open=false;this.innerHTML='';this.textContent='';this.isConnected=true;this.attributes={};}
  addEventListener(){}
  setAttribute(key,value){this.attributes[key]=value;}
  removeAttribute(key){delete this.attributes[key];}
  getClientRects(){return [{}];}
  focus(){}
  showModal(){this.open=true;}
  close(){this.open=false;}
  get validity(){return {valid:true};} // 原生邮箱约束留待实际浏览器检查。
}
const document={
  getElementById(id){if(!elements.has(id)) elements.set(id,new DisplayAdapter(id));return elements.get(id);},
  addEventListener(){},activeElement:null,body:{classList:{add(){},remove(){}}}
};
const context=vm.createContext({document,console,window:{
  setTimeout(callback){const id=++timerId;timers.set(id,callback);return id;},
  clearTimeout(id){timers.delete(id);},requestAnimationFrame(callback){callback();}
}});
vm.runInContext(script,context);
// 移除渲染器对动态 DOM 的依赖；其余提交、校验、撤销、权限与取消函数均用原版。
vm.runInContext('renderDrawer = function() {};',context);
const run=code=>vm.runInContext(code,context);
const snapshot=()=>JSON.parse(run('JSON.stringify(state)'));
function flush(){for(const [id,callback] of [...timers]){timers.delete(id);callback();}}
function begin(email,role='member'){
  run('openCreate()');document.getElementById('invite-email').value=email;document.getElementById('invite-role').value=role;
}
function submit(){run('submitInvitation()');}
function reset(){run('resetDemo()');}
const passed=[];
function check(name,fn){reset();fn();passed.push(name);console.log(`PASS ${name}`);}

check('必填与格式校验不创建邀请，并保留输入',()=>{
  begin('');submit();assert.match(snapshot().form.error,/请输入邮箱/);assert.equal(snapshot().invitations.length,1);
  begin('not-an-email');submit();assert.match(snapshot().form.error,/有效的邮箱/);assert.equal(snapshot().form.email,'not-an-email');assert.equal(timers.size,0);
});
check('已有成员邮箱按去空白与大小写进行重复检查',()=>{
  begin('  LIN@EXAMPLE.TEST  ','readonly');submit();assert.match(snapshot().form.error,/已经是工作区成员/);assert.equal(snapshot().form.email,'  LIN@EXAMPLE.TEST  ');assert.equal(snapshot().form.role,'readonly');
});
check('待接受邀请邮箱重复时保留输入且不创建',()=>{
  begin('CHEN.YU@example.test');submit();assert.match(snapshot().form.error,/已有待接受邀请/);assert.equal(snapshot().invitations.length,1);assert.equal(timers.size,0);
});
check('成功前有等待状态，成功后列表和详情选择指向同一邀请',()=>{
  begin('new.member@example.test','readonly');submit();assert.equal(snapshot().pending.kind,'send');assert.equal(snapshot().invitations.length,1);
  flush();const s=snapshot();assert.equal(s.pending,null);assert.equal(s.view,'success');assert.equal(s.invitations.length,2);assert.equal(s.invitations[0].email,'new.member@example.test');assert.equal(s.invitations[0].role,'readonly');assert.equal(s.selectedId,s.invitations[0].id);
  run('closeDrawer()');assert.equal(snapshot().invitations.length,2);assert.equal(snapshot().view,'closed');
});
check('发送中重复提交只排队一次',()=>{
  begin('double@example.test');submit();submit();assert.equal(timers.size,1);flush();assert.equal(snapshot().invitations.length,2);
});
check('失败保留邮箱角色，重试自动成功且只新增一次',()=>{
  run("state.outcome='fail-once'");begin('retry@example.test','readonly');submit();flush();let s=snapshot();assert.equal(s.view,'create');assert.equal(s.form.email,'retry@example.test');assert.equal(s.form.role,'readonly');assert.equal(s.form.errorKind,'send');assert.match(s.form.error,/服务暂时无法响应/);assert.equal(s.invitations.length,1);assert.equal(s.outcome,'success');
  submit();flush();s=snapshot();assert.equal(s.view,'success');assert.equal(s.invitations.length,2);assert.equal(s.invitations[0].role,'readonly');
});
check('填写后取消不创建邀请',()=>{
  begin('cancel@example.test','readonly');run('closeDrawer()');flush();assert.equal(snapshot().invitations.length,1);
});
check('发送中关闭会使计时器与旧请求失效',()=>{
  begin('cancel-pending@example.test');submit();run('closeDrawer()');assert.equal(timers.size,0);flush();assert.equal(snapshot().invitations.length,1);
});
check('取消撤销回到详情并保留邀请',()=>{
  run("openDetails('inv-1');requestRevoke()");assert.equal(snapshot().view,'revoke');run('cancelRevoke()');assert.equal(snapshot().view,'details');assert.equal(snapshot().invitations.length,1);
});
check('确认撤销移除目标并进入空态；可以重新邀请',()=>{
  run("openDetails('inv-1');requestRevoke();confirmRevoke()");assert.equal(snapshot().pending.kind,'revoke');flush();assert.equal(snapshot().invitations.length,0);assert.equal(snapshot().view,'closed');assert.equal(document.getElementById('invitation-empty').hidden,false);
  begin('chen.yu@example.test');submit();flush();assert.equal(snapshot().invitations.length,1);
});
check('撤销等待中取消保留邀请且没有迟到删除',()=>{
  run("openDetails('inv-1');requestRevoke();confirmRevoke();cancelRevoke()");flush();assert.equal(snapshot().invitations.length,1);assert.equal(snapshot().view,'details');
});
check('普通成员可读详情但不能创建或撤销',()=>{
  run("state.viewer='member';renderPermissions();openCreate()");assert.equal(snapshot().view,'closed');assert.equal(document.getElementById('invite-open').disabled,true);assert.equal(document.getElementById('permission-note').hidden,false);
  run("openDetails('inv-1');requestRevoke();confirmRevoke()");assert.equal(snapshot().view,'details');assert.equal(snapshot().invitations.length,1);assert.equal(timers.size,0);
});
check('等待过程中权限丢失时不能完成创建',()=>{
  begin('role-changed@example.test');submit();run("state.viewer='member'");flush();assert.equal(snapshot().invitations.length,1);
});
check('重置清理待处理请求并恢复数据、身份与发送模式',()=>{
  begin('reset@example.test');submit();run("state.viewer='member';state.outcome='fail-once'");reset();flush();const s=snapshot();assert.equal(s.invitations.length,1);assert.equal(s.invitations[0].id,'inv-1');assert.equal(s.viewer,'admin');assert.equal(s.outcome,'success');assert.equal(s.pending,null);assert.equal(s.view,'closed');assert.equal(timers.size,0);
});
check('用户输入在 HTML 输出前转义',()=>{
  assert.equal(run("escapeHTML('<img src=x>&\"')"),'&lt;img src=x&gt;&amp;&quot;');
});

console.log(`\n${passed.length} 项状态逻辑检查通过。`);
console.log('未验证：真实 DOM 事件、浏览器原生邮箱校验、dialog 模态/焦点、键盘操作、视觉布局、滚动、窄屏与屏幕阅读器。');
console.log('此结果不代表真实邮件、生产权限、服务端规范化、原子去重或用户确认。');
