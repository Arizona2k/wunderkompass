// Bounded illustrative values, not readings from a physical instrument.
export function lengthUnits(centimetres){
 if(!Number.isFinite(centimetres)||centimetres<10||centimetres>200)throw Error('Length outside model');
 return {centimetres,metres:centimetres/100};
}
export function timeInterval(start,duration){
 if(![10,20].includes(start)||!Number.isInteger(duration)||duration<1||duration>10)throw Error('Time outside model');
 return {start,end:start+duration,duration};
}
export function temperatureUnits(celsius){
 if(!Number.isFinite(celsius)||celsius< -20||celsius>40)throw Error('Temperature outside model');
 return {celsius,kelvin:Number((celsius+273.15).toFixed(2))};
}
