// Own illustrative arithmetic for the mechanics learning figures; no actual material data.
export function forceStep(left:number,right:number,mass:number,velocity:number,seconds=1){
 if(![left,right,mass,velocity,seconds].every(Number.isFinite)||left<0||right<0||mass<=0||seconds<0)throw Error('Invalid illustrative motion inputs');
 const net=right-left,acceleration=net/mass;
 return {net,acceleration,velocityAfter:velocity+acceleration*seconds};
}
export function straightSamples(velocity:number){
 if(!Number.isFinite(velocity))throw Error('Invalid velocity');
 return [0,1,2,3].map(seconds=>({seconds,position:velocity===0||seconds===0?0:velocity*seconds}));
}
export function torqueMagnitude(force:number,radius:number,angle:number){
 if(![force,radius,angle].every(Number.isFinite)||force<0||radius<0||angle<0||angle>180)throw Error('Invalid illustrative lever inputs');
 const perpendicularArm=radius*Math.abs(Math.sin(angle*Math.PI/180));
 const arm=perpendicularArm<1e-12?0:perpendicularArm;
 return {perpendicularArm:arm,moment:force*arm};
}
export type ElasticCase='linear'|'nonlinear'|'permanent';
export type LoadStep=0|1|2;
export function elasticSketch(kind:ElasticCase,load:LoadStep,previouslyBeyondLimit:boolean){
 if(!['linear','nonlinear','permanent'].includes(kind)||![0,1,2].includes(load))throw Error('Invalid illustrative elastic state');
 // These are deliberately invented drawing lengths, not a real force law,
 // elastic limit or prediction of safe loads for any actual spring/material.
 if(load===0)return kind==='permanent'&&previouslyBeyondLimit?12:0;
 return kind==='nonlinear'?10*load+5*load*load:20*load;
}
