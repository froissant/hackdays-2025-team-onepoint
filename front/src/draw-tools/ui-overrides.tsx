import {
	DefaultKeyboardShortcutsDialog,
	DefaultKeyboardShortcutsDialogContent,
	DefaultToolbar,
	DefaultToolbarContent,
	type TLComponents,
	type TLUiAssetUrlOverrides,
	type TLUiOverrides,
	TldrawUiMenuItem,
	useIsToolSelected,
	useTools,
} from 'tldraw'

// There's a guide at the bottom of this file!

export const uiOverrides: TLUiOverrides = {
	tools(editor, tools) {
		// Create a tool item in the ui's context.
		tools.meme = {
			id: 'meme-tool',
			icon: 'color',
			label: 'Meme',
			kbd: 'm',
			onSelect: () => {
				editor.setCurrentTool('meme-tool')
			},
		}
		return tools
	},
}

export const components: TLComponents = {
	Toolbar: (props) => {
		const tools = useTools()
		const isMemeSelected = useIsToolSelected(tools['meme'])
		return (
			<DefaultToolbar {...props}>
				<DefaultToolbarContent />
				<TldrawUiMenuItem {...tools['meme']} isSelected={isMemeSelected} />
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
