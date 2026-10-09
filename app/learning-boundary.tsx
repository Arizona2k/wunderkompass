"use client";
import {Component,type ReactNode} from 'react';
export default class LearningBoundary extends Component<{children:ReactNode;name:string},{failed:boolean}>{
 state={failed:false};static getDerivedStateFromError(){return {failed:true};}
 render(){if(this.state.failed)return <section className="error-learning" role="alert"><h2>{this.props.name} braucht noch einen Versuch.</h2><p>Dein Entdeckerpass bleibt gespeichert. Lade die Seite noch einmal, um weiterzumachen.</p><button className="primary-button" onClick={()=>window.location.reload()}>Seite neu laden</button></section>;return this.props.children;}
}
