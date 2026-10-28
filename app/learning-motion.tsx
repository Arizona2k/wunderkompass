'use client';

import {createContext,forwardRef,useContext,type ReactNode} from 'react';
import {AnimatePresence,LazyMotion,MotionConfig,domMax,m,useIsPresent,useReducedMotion} from 'motion/react';
import type {Transition} from 'motion/react';

// Layout changes use the same short tween instead of Motion's implicit spring.
export const learningLayoutTransition:Transition={layout:{type:'tween',duration:.24,ease:[.2,.8,.2,1]}};

// This module is imported by the existing lazy learning areas, never by Home.
// Content is rendered immediately; optional motion does not gate navigation.
const QuietMotion=createContext(true);
export function LearningMotion({reducedMotion,children}:{reducedMotion:boolean;children:ReactNode}){
 const systemQuiet=useReducedMotion();
 const quiet=reducedMotion||systemQuiet===true;
 return <LazyMotion features={domMax} strict><MotionConfig reducedMotion={quiet?'always':'user'} transition={quiet?{duration:0}:{duration:.24,ease:[.2,.8,.2,1]}}><QuietMotion.Provider value={quiet}>{children}</QuietMotion.Provider></MotionConfig></LazyMotion>;
}
export function useQuietLearningMotion(){return useContext(QuietMotion);}

const FeedbackFrame=forwardRef<HTMLDivElement,{children:ReactNode;className:string}>(function FeedbackFrame({children,className},ref){
 const quiet=useQuietLearningMotion(),present=useIsPresent();
 return <m.div ref={ref} className={className} role={present?'status':undefined} aria-hidden={!present} inert={!present} initial={quiet?false:{y:6}} animate={{opacity:1,y:0,height:'auto'}} exit={{opacity:quiet?1:0,height:0,marginTop:0,marginBottom:0,paddingTop:0,paddingBottom:0}} style={{overflow:'hidden'}}>{children}</m.div>;
});

export function LearningFeedback({active,className='lab-feedback',children}:{active:boolean;className?:string;children:ReactNode}){
 // Keep one stable feedback node while the selected answer changes. Closing
 // removes it from focus/AT immediately, then finishes its visual transition.
 return <AnimatePresence initial={false}>{active&&<FeedbackFrame key="learning-feedback" className={className}>{children}</FeedbackFrame>}</AnimatePresence>;
}
