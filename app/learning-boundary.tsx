"use client";
import {Component,type ReactNode} from 'react';
import {LearningStatus} from './learning-components';
export default class LearningBoundary extends Component<{children:ReactNode;name:string},{failed:boolean}>{
 state={failed:false};static getDerivedStateFromError(){return {failed:true};}
 render(){if(this.state.failed)return <LearningStatus tone="error" className="error-learning" action={<button className="primary-button" onClick={()=>window.location.reload()}>Seite neu laden</button>}><strong>{this.props.name} braucht noch einen Versuch.</strong><br/>Dein Entdeckerpass bleibt gespeichert. Lade die Seite noch einmal, um weiterzumachen.</LearningStatus>;return this.props.children;}
}
