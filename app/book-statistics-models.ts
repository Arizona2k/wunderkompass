export const figureKinds=['ruler-offset','repeat-and-offset','sample-selection','mean-and-median','independent-trials','numbered-intervals','plan-scale'] as const;
export type StatisticsFigureKind=typeof figureKinds[number];
export const numberFormat=new Intl.NumberFormat('de-DE',{maximumFractionDigits:2});
export const locationCases=[[2,4,9],[2,4,24],[1,3,8,12],[2,2,9]] as const;
export const repetitionCases=[[119,120,121],[124,125,126],[125,125,125]] as const;
export const selections=[[0,1,2,3],[0,5,10,11],Array.from({length:12},(_,i)=>i)] as const;
export const sequences=['AAA','ABB','BAB'] as const;
export const scales=[10,25,5] as const;
export const planScales=[50,100,200] as const;
export function location(values:readonly number[]){
 if(!values.length||!values.every(Number.isFinite))throw Error('Finite nonempty sample required');
 const sorted=values.toSorted((a,b)=>a-b),n=sorted.length,mean=sorted.reduce((a,b)=>a+b,0)/n,median=n%2?sorted[(n-1)/2]:(sorted[n/2-1]+sorted[n/2])/2;
 return{mean,median,min:sorted[0],max:sorted[n-1],range:sorted[n-1]-sorted[0],sorted};
}
export function ratioLength(realCM:number,denominator:number){if(!Number.isFinite(realCM)||realCM<0||!Number.isFinite(denominator)||denominator<=0)throw Error('Nonnegative finite length and positive scale required');return realCM/denominator;}
export function sampleCircles(indices:readonly number[]){if(!indices.length||new Set(indices).size!==indices.length||indices.some(i=>!Number.isInteger(i)||i<0||i>=12))throw Error('Distinct displayed form indices required');return{circles:indices.filter(i=>i<4).length,total:indices.length};}
