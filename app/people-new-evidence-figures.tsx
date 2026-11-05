import type {ComponentType} from 'react';
import {CepheidEvidenceFigure,SpectralEvidenceFigure,DiffractionEvidenceFigure,PulseEvidenceFigure} from './people-astronomy-evidence';
import {PrintRegistrationEvidenceFigure,NarrativeTransmissionEvidenceFigure} from './people-literature-evidence';
import {FoodTransferEvidenceFigure,NarrativeInformationEvidenceFigure} from './people-environment-evidence';
import {ParticipationRuleEvidenceFigure} from './people-participation-evidence';
import {DirectionCountEvidenceFigure,FindingExplanationEvidenceFigure,ExhibitionRouteEvidenceFigure,InventedLineEvidenceFigure,TextTransmissionEvidenceFigure} from './people-additional-evidence';
export const additionalPeopleFigures:Record<string,ComponentType<{selected:number;onSelect:(value:number)=>void}>>={
"cepheid-evidence":CepheidEvidenceFigure,
"spectral-evidence":SpectralEvidenceFigure,
"diffraction-evidence":DiffractionEvidenceFigure,
"pulse-evidence":PulseEvidenceFigure,
"print-registration-evidence":PrintRegistrationEvidenceFigure,
"narrative-and-transmission-evidence":NarrativeTransmissionEvidenceFigure,
"food-transfer-evidence":FoodTransferEvidenceFigure,
"narrative-information-evidence":NarrativeInformationEvidenceFigure,
"equal-participation-rule-reading":ParticipationRuleEvidenceFigure,
"direction-count-evidence":DirectionCountEvidenceFigure,
"finding-explanation-evidence":FindingExplanationEvidenceFigure,
"exhibition-route-evidence":ExhibitionRouteEvidenceFigure,
"invented-line-evidence":InventedLineEvidenceFigure,
"text-transmission-evidence":TextTransmissionEvidenceFigure,
};
