import images from './research-preview-images.json';
export default function ResearchPreview({id,noteId}:{id:string;noteId?:string}){
 const image=images[id as keyof typeof images];if(!image)return null;
 return <span className={'research-preview research-preview-'+id}><img src={image.src} width={image.width} height={image.height} alt={image.alt} loading="lazy" decoding="async"/><span className="research-preview-credit" id={noteId}>Eigene Modellvorschau · KI-unterstützt<span>{image.caption}</span></span></span>;
}
