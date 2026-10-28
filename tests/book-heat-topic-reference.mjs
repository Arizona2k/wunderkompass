import {createHash} from 'node:crypto';
import before from './fixtures/heat-topic-before-book-20261028.json' with {type:'json'};
// Only the exact separately reviewed heat followup can project to its genuine
// historical release boundary. Unknown changes still fail the original hashes.
export function topicBeforeBookHeatFollowup(topic){
 return topic.id==='science-heat-transfer'&&createHash('sha256').update(JSON.stringify(topic)).digest('hex')==='50d9a3a82746412bae92707373a42925df054405eefd6051bc9dc89dd9784d84'?before.topic:topic;
}
