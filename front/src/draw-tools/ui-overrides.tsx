import {
	ArrowDownToolbarItem,
	ArrowLeftToolbarItem,
	ArrowRightToolbarItem,
	ArrowToolbarItem,
	ArrowUpToolbarItem,
	AssetToolbarItem,
	CheckBoxToolbarItem,
	CloudToolbarItem,
	DefaultKeyboardShortcutsDialog,
	DefaultKeyboardShortcutsDialogContent,
	DefaultToolbar,
	DiamondToolbarItem,
	DrawToolbarItem,
	EllipseToolbarItem,
	EraserToolbarItem,
	FrameToolbarItem,
	HandToolbarItem,
	HexagonToolbarItem,
	HighlightToolbarItem,
	LaserToolbarItem,
	LineToolbarItem,
	NoteToolbarItem,
	OvalToolbarItem,
	RectangleToolbarItem,
	RhombusToolbarItem,
	SelectToolbarItem,
	StarToolbarItem,
	type TLComponents,
	type TLUiAssetUrlOverrides,
	type TLUiOverrides,
	TextToolbarItem,
	TldrawUiMenuItem,
	TriangleToolbarItem,
	XBoxToolbarItem,
	useEditor,
	useIsToolSelected,
	useTools,
} from 'tldraw'
import { MemeToolDialog } from './MemeToolDialog'
import { useState } from 'react'
import { MemeTool } from './MemeTool'


// There's a guide at the bottom of this file!

export const uiOverrides: TLUiOverrides = {
	tools(_editor, tools) {
		// Create a tool item in the ui's context.
		tools.meme = {
			id: 'meme-tool',
			icon: 'color',
			label: 'Meme',
			kbd: 'm',
			onSelect: () => { },
		}
		return tools
	},
}

export const components: TLComponents = {
	Toolbar: (props) => {
		const tools = useTools()
		const editor = useEditor();
		const [dialogOpen, setDialogOpen] = useState(false);
		const isMemeSelected = useIsToolSelected(tools['meme'])

		function handleMemeDialog() {
			editor.blur();
			setDialogOpen(true);
		}

		function handleMemeMessage(message: string) {
			setDialogOpen(false);
			if (message) {
				tools.meme.onSelect("dialog");
				editor.setCurrentTool('meme-tool', { message: message })
			}
		}
		return (
			<DefaultToolbar {...props}>
				<SelectToolbarItem />
				<HandToolbarItem />
				<div style={{ width: "1px", height: "24px", backgroundColor: "#D9D9D9" }}></div>
				<DrawToolbarItem />
				<EraserToolbarItem />
				<ArrowToolbarItem />
				<TextToolbarItem />
				<NoteToolbarItem />
				<AssetToolbarItem />

				<RectangleToolbarItem />
				<EllipseToolbarItem />
				<TriangleToolbarItem />
				<DiamondToolbarItem />

				<HexagonToolbarItem />
				<OvalToolbarItem />
				<RhombusToolbarItem />
				<StarToolbarItem />

				<CloudToolbarItem />
				<XBoxToolbarItem />
				<CheckBoxToolbarItem />

				<ArrowLeftToolbarItem />
				<ArrowUpToolbarItem />
				<ArrowDownToolbarItem />
				<ArrowRightToolbarItem />

				<LineToolbarItem />
				<HighlightToolbarItem />
				<LaserToolbarItem />
				<FrameToolbarItem />
				<TldrawUiMenuItem {...tools['meme']} isSelected={isMemeSelected} onSelect={handleMemeDialog} />
				<MemeToolDialog open={dialogOpen} onClose={handleMemeMessage} />
			</DefaultToolbar>
		)
	},
	KeyboardShortcutsDialog: (props) => {
		const tools = useTools()
		return (
			<DefaultKeyboardShortcutsDialog {...props}>
				<DefaultKeyboardShortcutsDialogContent />
				<TldrawUiMenuItem {...tools['meme']} />
			</DefaultKeyboardShortcutsDialog>
		)
	},
}

export const customAssetUrls: TLUiAssetUrlOverrides = {
	icons: {
		'tool-meme': '/tool-meme.svg',
	},
}

export const customTools = [MemeTool];
