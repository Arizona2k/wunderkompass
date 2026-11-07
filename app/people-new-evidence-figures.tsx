import {PeopleOrderedOperationsFigure} from "./people-retained-evidence/ada-lovelace";
import {PeopleEqualStepsFigure} from "./people-retained-evidence/al-khwarizmi";
import {PeoplePhotonEnergyFigure} from "./people-retained-evidence/albert-einstein";
import {PeopleHeightTemperatureFigure} from "./people-retained-evidence/alexander-humboldt";
import {PeopleTestConditionsFigure} from "./people-retained-evidence/bertha-benz";
import {PeopleFibreDistributionFigure} from "./people-retained-evidence/cai-lun";
import {PeopleGenerationsFigure} from "./people-retained-evidence/charles-darwin";
import {PeopleInstructionMeaningFigure} from "./people-retained-evidence/grace-hopper";
import {PeopleToolPreparationFigure} from "./people-retained-evidence/jane-goodall";
import {PeopleReusableLettersFigure} from "./people-retained-evidence/johannes-gutenberg";
import {PeopleDriveConnectionFigure} from "./people-retained-evidence/karl-benz";
import {PeopleCalculationCheckFigure} from "./people-retained-evidence/katherine-johnson";
import {PeopleSharedFallFigure} from "./people-retained-evidence/mae-jemison";
import {PeopleMeasurementHypothesisFigure} from "./people-retained-evidence/marie-curie";
import {PeopleMissionRolesFigure} from "./people-retained-evidence/neil-armstrong";
import {PeopleWebLinksFigure} from "./people-retained-evidence/tim-berners-lee";
import {PeopleEvidenceScopeFigure} from "./people-retained-evidence/tu-youyou";
import {PeopleTreeFollowUpFigure} from "./people-retained-evidence/wangari-maathai";
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
"ordered-operations-evidence":PeopleOrderedOperationsFigure,
"equal-steps-evidence":PeopleEqualStepsFigure,
"photon-number-vs-single-energy":PeoplePhotonEnergyFigure,
"height-temperature-note-comparison":PeopleHeightTemperatureFigure,
"test-conditions-evidence":PeopleTestConditionsFigure,
"fibre-distribution-evidence":PeopleFibreDistributionFigure,
"inherited-variants-generations":PeopleGenerationsFigure,
"instruction-meaning-evidence":PeopleInstructionMeaningFigure,
"tool-preparation-observation":PeopleToolPreparationFigure,
"reusable-letter-order-evidence":PeopleReusableLettersFigure,
"drive-connection-scope":PeopleDriveConnectionFigure,
"calculation-check-evidence":PeopleCalculationCheckFigure,
"shared-freefall-relative-distance":PeopleSharedFallFigure,
"measurement-and-hypothesis-evidence":PeopleMeasurementHypothesisFigure,
"apollo11-roles-snapshots":PeopleMissionRolesFigure,
"web-note-links":PeopleWebLinksFigure,
"evidence-scope-comparison":PeopleEvidenceScopeFigure,
"tree-follow-up":PeopleTreeFollowUpFigure,
};
