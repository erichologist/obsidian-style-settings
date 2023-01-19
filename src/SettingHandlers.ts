import {SettingType} from "./settingsView/SettingComponents/SettingComponentFactory";
import {CSSSettingsManager} from "./SettingsManager";
import {HeadingSettingComponent} from "./settingsView/SettingComponents/HeadingSettingComponent";

export const resetTooltip = "Restore default";

export interface WithTitle {
	title: string;
	"title.ar"?: string;
	"title.cz"?: string;
	"title.da"?: string;
	"title.de"?: string;
	"title.es"?: string;
	"title.fr"?: string;
	"title.hi"?: string;
	"title.id"?: string;
	"title.it"?: string;
	"title.ja"?: string;
	"title.ko"?: string;
	"title.nl"?: string;
	"title.no"?: string;
	"title.pl"?: string;
	"title.pt-BR"?: string;
	"title.pt"?: string;
	"title.ro"?: string;
	"title.ru"?: string;
	"title.sq"?: string;
	"title.tr"?: string;
	"title.uk"?: string;
	"title.zh-TW"?: string;
	"title.zh"?: string;
}

export interface WithDescription {
	description?: string;
	"description.ar"?: string;
	"description.cz"?: string;
	"description.da"?: string;
	"description.de"?: string;
	"description.es"?: string;
	"description.fr"?: string;
	"description.hi"?: string;
	"description.id"?: string;
	"description.it"?: string;
	"description.ja"?: string;
	"description.ko"?: string;
	"description.nl"?: string;
	"description.no"?: string;
	"description.pl"?: string;
	"description.pt-BR"?: string;
	"description.pt"?: string;
	"description.ro"?: string;
	"description.ru"?: string;
	"description.sq"?: string;
	"description.tr"?: string;
	"description.uk"?: string;
	"description.zh-TW"?: string;
	"description.zh"?: string;
}

export interface Meta extends WithTitle, WithDescription {
	id: string;
	type: SettingType;
}

export interface Heading extends Meta {
	level: 0 | 1 | 2 | 3 | 4 | 5 | 6;
	collapsed?: boolean;
	resetFn?: () => void;
}

export interface ClassToggle extends Meta {
	default?: boolean;
}

export interface SelectOption {
	label: string;
	value: string;
}

export interface ClassMultiToggle extends Meta {
	default?: string;
	allowEmpty: boolean;
	options: Array<string | SelectOption>;
}

export interface VariableText extends Meta {
	default: string;
	quotes?: boolean;
}

export interface VariableNumber extends Meta {
	default: number;
	format?: string;
}

export interface VariableNumberSlider extends Meta {
	default: number;
	min: number;
	max: number;
	step: number;
	format?: string;
}

export interface VariableSelect extends Meta {
	default: string;
	options: Array<string | SelectOption>;
	quotes?: boolean;
}

export type ColorFormat =
	| "hsl"
	| "hsl-values"
	| "hsl-split"
	| "rgb"
	| "rgb-values"
	| "rgb-split"
	| "hex";

export interface VariableColor extends Meta {
	default?: string;
	format: ColorFormat;
	"alt-format"?: Array<{ id: string; format: ColorFormat }>;
	opacity?: boolean;
}

export interface ColorGradient extends Meta {
	from: string;
	to: string;
	format: "hsl" | "rgb" | "hex";
	pad?: number;
	step: number;
}

export type AltFormatList = Array<{ id: string; format: ColorFormat }>;

export interface VariableThemedColor extends Meta {
	"default-light": string;
	"default-dark": string;
	format: ColorFormat;
	"alt-format": AltFormatList;
	opacity?: boolean;
}

export type CSSSetting =
	| Heading
	| ClassToggle
	| ClassMultiToggle
	| VariableText
	| VariableNumber
	| VariableNumberSlider
	| VariableSelect
	| VariableColor
	| VariableThemedColor;

export interface ParsedCSSSettings {
	name: string;
	id: string;
	settings: Array<CSSSetting>;
}

export function buildSettingComponentTree(opts: {
	isView: boolean;
	sectionId: string;
	sectionName: string;
	settings: Meta[];
	settingsManager: CSSSettingsManager;
}): HeadingSettingComponent {
	const {
		isView,
		sectionId,
		settings,
		settingsManager,
		sectionName,
	} = opts;

	const root: HeadingSettingComponent = new HeadingSettingComponent(sectionId, sectionName, settings[0], settingsManager, isView);

	console.log(settings);

	let currentHeading: HeadingSettingComponent = root;

	for (let setting of settings.splice(1)) {
		if (setting.type === "heading") {
			const newHeading: Heading = setting as Heading;

			// console.log(newHeading);

			if (newHeading.level < currentHeading.setting.level) {
				while (newHeading.level < currentHeading.setting.level) {
					currentHeading = currentHeading.parent;
				}

				currentHeading = currentHeading.parent.addChild(newHeading) as HeadingSettingComponent;
			} else if (newHeading.level === currentHeading.setting.level) {
				currentHeading = currentHeading.parent.addChild(newHeading) as HeadingSettingComponent;
			} else {
				currentHeading = currentHeading.addChild(newHeading) as HeadingSettingComponent;
			}

		} else {
			currentHeading.addChild(setting);
		}
	}


	return root;
}