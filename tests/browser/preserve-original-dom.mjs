import assert from 'node:assert/strict';

// Negative probes may alter attributes or detach a shape. Restore the exact
// original nodes so a mounted React view can still update them afterwards.
// Recreating identical innerHTML would leave React pointing at detached nodes.
export async function preserveOriginalDOM(locator){
 const original=await locator.evaluateHandle(root=>{
  const nodes=[];
  function visit(node){nodes.push({node,children:[...node.childNodes],value:node.nodeValue,attributes:node.nodeType===1?[...node.attributes].map(a=>[a.name,a.value]):null});for(const child of node.childNodes)visit(child);}
  visit(root);return{root,html:root.innerHTML,nodes};
 });
 return async()=>{
  try{
   const result=await original.evaluate(({root,html,nodes})=>{
    for(const row of nodes){
     if(row.attributes){for(const a of [...row.node.attributes])row.node.removeAttribute(a.name);for(const[name,value]of row.attributes)row.node.setAttribute(name,value);}
     else row.node.nodeValue=row.value;
     if(row.node.nodeType===1){const actual=[...row.node.childNodes];if(actual.length!==row.children.length||actual.some((node,i)=>node!==row.children[i]))row.node.replaceChildren(...row.children);}
    }
    return{sameHTML:root.innerHTML===html,originalNodesConnected:nodes.every(({node})=>node.isConnected&&root.contains(node))};
   });
   assert.deepEqual(result,{sameHTML:true,originalNodesConnected:true},'negative probe restores exact original markup and node identities');
  }finally{await original.dispose();}
 };
}
