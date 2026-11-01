/** Complete only the displayed answer sentence; authored answers and stored data stay unchanged. */
export function bookAnswerSentence(answer:string){
 const text=answer.trimEnd();
 return text&&!/[.!?…]$/.test(text)?text+'.':text;
}
