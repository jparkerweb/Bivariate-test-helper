// -----------------------------------------------------------------------------
// -- Bivariate Test Helper (Class List grabber / Puppeteer script generator) --
// -----------------------------------------------------------------------------
if (document.querySelector(".bivariate-tbm.toolbox-markup")) {
	let theToolbox = document.querySelector(".bivariate-tbm.toolbox-markup")
	if (theToolbox.classList.contains('toolbox-markup-display--hide')) {
		theToolbox.classList.remove('toolbox-markup-display--hide')
	} else {
		theToolbox.classList.add('toolbox-markup-display--hide')
	}
}
else {
	let toolboxStyle = `
		.toolbox-markup-display--show { display: flex !important; }
		.toolbox-markup-display--hide { display: none !important; }

		.toolbox-markup-target-outline { outline: 2px dashed green; }
		.toolbox-markup-target-outline--empty { outline: 2px dashed red; }

		.toolbox-markup * { box-sizing: border-box; }
		.toolbox-markup {
			position: fixed;
			top: 5px;
			display: flex;
			flex-direction: column;
			padding: 10px;
			width: 500px;
			height: 650px;
			border: 1px solid #888;
			color: #333;
			background: #efefefcf;
			border-radius: 4px;
			text-align: left;
			box-sizing: border-box;
			z-index: 9999999;
			font-family:
				"SFMono-Regular",
				Consolas,
				"Liberation Mono",
				Menlo,
				Courier,
				monospace;
			font-size: 16px;
		}
		.toolbox-markup--left { left: 5px; }
		.toolbox-markup--right { right: 5px; }

		.toolbox-markup button {
			margin-bottom: 6px !important;
			margin-right: 5px !important;
			padding: 0px 10px !important;
			height: 20px !important;
			max-height: 20px !important;
			line-height: 1 !important;
			text-transform: uppercase !important;
			background: #efefef !important;
			color: #333 !important;
			font-size: 11px !important;
			box-shadow: none !important;
			border: 1px solid #777 !important;
		}

		.toolbox-markup__message {
			margin-left: auto;
			color: maroon;
		}
		.toolbox-markup__message.-message-bottom {
			padding-right: 100px;
		}

		.toolbox-markup__class-list {
			flex: 1;
			margin-bottom: 10px;
			padding: 5px;
			width: 100%;
			overflow-y: auto;
			border: 1px solid #777;
			border-radius: 4px;
			background: #ffe;
			font-size: 16px;
		}

		.toolbox-markup__class-list__item {
			margin: 5px 0;
			padding: 5px;
			border-bottom: 1px solid #ddd;
			cursor: pointer;
		}
		.toolbox-markup__class-list__item--selected {
			outline: 2px solid #333;
		}

		.toolbox-markup__commands {
			flex: 1;
			margin-top: 5px;
			margin-bottom: 15px;
			padding: 5px;
			width: 100%;
			overflow-y: auto;
			overflow-x: auto;
			border: 1px solid #777;
			border-radius: 4px;
			background: #222;
			color: lightgreen;
			white-space: nowrap;
		}

		.toolbox-markup__logo {
			position: absolute;
			right: 11px;
			bottom: 10px;
		}
		.toolbox-markup__logo-image {
			height: 30px;
		}
	`

	let documentHead = document.head || document.getElementsByTagName('head')[0]
	let newStyle = document.createElement('style')

	documentHead.appendChild(newStyle)
	newStyle.type = 'text/css'
	newStyle.appendChild(document.createTextNode(toolboxStyle))

	let toolboxMarkupClassListInstructions = "Hover over an element in the page and press the 'b' key to add its class list here.  Once added you can click on it in this list to copy it to your clipboard.  After a class list item is selected you can additionally click a command button below to add the command to the command list builder.<br><br>The command list can be copied by clicking the copy button on the bottom, to be used in external puppeteer scripts."

	let toolboxMarkup = `
		<div class='bivariate-tbm toolbox-markup toolbox-markup--right'>
			<input id="inputSelectedClass" type="text" class="bivariate-tbm" style="display: none !important;" />
			<div class="bivariate-tbm" style="display: flex;">
				<button id='btnBivariateMoveLeft' type='button' class="bivariate-tbm toolbox-markup__move">&lt;</button>
				<button id='btnBivariateMoveRight' type='button' class="bivariate-tbm toolbox-markup__move">&gt;</button>
				<button id='btnBivariateClearCLassList' type='button' class="bivariate-tbm toolbox-markup__button">clear</button>
				<button id='btnBivariateClose' type='button' class="bivariate-tbm toolbox-markup__button">close</button>
				<span class="bivariate-tbm toolbox-markup__message -message-top"><span>
			</div>
			<div class="bivariate-tbm toolbox-markup__class-list">` + toolboxMarkupClassListInstructions + `</div>
			<div class="bivariate-tbm" style="display: flex; flex-wrap: wrap;">
				<button id='btnBivariateToolboxCommandWaitForSelector' type='button' class="bivariate-tbm toolbox-markup__command-button">waitForSelector('.selector')</button>
				<button id='btnBivariateToolboxCommandHover' type='button' class="bivariate-tbm toolbox-markup__command-button">hover('.selector')</button>
				<button id='btnBivariateToolboxCommandClick' type='button' class="bivariate-tbm toolbox-markup__command-button">click('.selector')</button>
				<button id='btnBivariateToolboxCommandFocus' type='button' class="bivariate-tbm toolbox-markup__command-button">focus('.selector')</button>
				<button id='btnBivariateToolboxCommandType' type='button' class="bivariate-tbm toolbox-markup__command-button">type('.selector', 'some text')</button>
				<button id='btnBivariateToolboxCommandWaitFor' type='button' class="bivariate-tbm toolbox-markup__command-button">waitFor(300)</button>
			</div>
			<div class="bivariate-tbm toolbox-markup__divider"></div>
			<div class="bivariate-tbm toolbox-markup__commands"></div>
			<div class="bivariate-tbm" style="display: flex;">
				<button id='btnBivariateToolboxCopyCommands' type='button' class="bivariate-tbm toolbox-markup__button">copy</button>
				<button id='btnBivariateToolboxClearCommands' type='button' class="bivariate-tbm toolbox-markup__button">clear</button>
				<span class="bivariate-tbm toolbox-markup__message -message-bottom"><span>
			</div>
			<a class="bivariate-tbm toolbox-markup__logo" href="https://github.com/jparkerweb/Bivariate-test-helper" target="_blank" alt="Bivariate test helper"><img class="bivariate-tbm toolbox-markup__logo-image" src="data:image/png;base64,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" />
		</div>
	`

	document.body.innerHTML = document.body.innerHTML + toolboxMarkup

	let toolboxLastBivariateElementClassList = null
	let toolboxClassList = document.querySelector(".toolbox-markup__class-list")
	let toolboxClassListItemId = 0

	document.body.addEventListener("keydown", event => {
		event = event || window.event
		toolboxClassListItemId++
		if (event.code === 'KeyB' && toolboxLastBivariateElementClassList && !toolboxLastBivariateElementClassList.includes('bivariate-tbm') && !toolboxLastBivariateElementClassList.includes('toolbox-markup-target-outline--empty') && toolboxLastBivariateElementClassList !== "") {
			if (toolboxClassList.innerHTML === toolboxMarkupClassListInstructions) { toolboxClassList.innerHTML = "" }

			let newToolboxItem = document.createElement('div')
			newToolboxItem.id = "toolboxItem" + toolboxClassListItemId
			newToolboxItem.classList = "bivariate-tbm toolbox-markup__class-list__item"
			newToolboxItem.innerHTML = toolboxLastBivariateElementClassList
			toolboxClassList.appendChild(newToolboxItem)

			document.getElementById(newToolboxItem.id).addEventListener("click", toolboxSelectClassListItem)
			document.getElementById(newToolboxItem.id).classListItemId = "toolboxItem" + toolboxClassListItemId
			document.getElementById(newToolboxItem.id).elementClassList = toolboxLastBivariateElementClassList
			toolboxClassList.scrollTop = toolboxClassList.scrollHeight
		}
	})

	document.body.addEventListener("mouseover", event => {
		event = event || window.event
		let targetElm = event.target || event.srcElement
		let theToolbox = document.querySelector(".bivariate-tbm.toolbox-markup")

		if (targetElm.classList && !targetElm.classList.value.includes('bivariate-tbm') && !theToolbox.classList.contains('toolbox-markup-display--hide')) {
			let targetOutlineTimeout = 500
			let targetOutlineClass = targetElm.classList.value !== "" ? "toolbox-markup-target-outline" : "toolbox-markup-target-outline--empty"

			toolboxLastBivariateElementClassList = targetElm.classList.value.replace(/ /g, ".")
			toolboxLastBivariateElementClassList = toolboxLastBivariateElementClassList.replace(/\.toolbox-markup-target-outline/g, "")

			if (toolboxLastBivariateElementClassList !== "") {
				toolboxLastBivariateElementClassList = "." + toolboxLastBivariateElementClassList
			}

			targetElm.classList.add(targetOutlineClass)

			setTimeout(function(){
				targetElm.classList.remove(targetOutlineClass)
			}, targetOutlineTimeout)
		}
	}, false)


	let script = ""

	let toolboxMove = function toolboxMove(evt) {
		direction = evt.currentTarget.myParam
		let toolbox = document.querySelector(".toolbox-markup")

		if (direction === 'left') {
			toolbox.classList.add('toolbox-markup--left')
			toolbox.classList.remove('toolbox-markup--right')
		} else {
			toolbox.classList.add('toolbox-markup--right')
			toolbox.classList.remove('toolbox-markup--left')
		}
	}

	let toolboxClearClassList = function toolboxClearClassList() {
		let toolboxMarkupClassListInstructions = "Hover over an element in the page and press the 'b' key to add its class list here.  Once added you can click on it in this list to copy it to your clipboard.  After a class list item is selected you can additionally click a command button below to add the command to the command list builder.<br><br>The command list can be copied by clicking the copy button on the bottom, to be used in external puppeteer scripts."

		let classListItems = document.querySelector(".toolbox-markup__class-list")
			classListItems.innerHTML = toolboxMarkupClassListInstructions

		document.getElementById("inputSelectedClass").value = ""
	}

	let toolboxClose = function toolboxClose() {
		let theToolbox = document.querySelector(".bivariate-tbm.toolbox-markup")
		theToolbox.classList.add('toolbox-markup-display--hide')
	}

	let toolboxSelectClassListItem = function toolboxSelectClassListItem(evt) {
		let classListItemId = evt.currentTarget.classListItemId
		let classListItemStr = evt.currentTarget.elementClassList

		let currentlySelected = document.querySelector(".toolbox-markup__class-list__item--selected")
		if (currentlySelected) {currentlySelected.classList.remove("toolbox-markup__class-list__item--selected") }

		let toBeSelected = document.querySelector("#" + classListItemId)
		if (toBeSelected) { toBeSelected.classList.add("toolbox-markup__class-list__item--selected") }

		document.getElementById("inputSelectedClass").value = classListItemStr
		toolboxCopyStringToClipboard(classListItemStr)

		let toolboxMessageTop = document.querySelector(".toolbox-markup__message.-message-top")
		toolboxMessageTop.innerHTML = "item class copied to clipboard"

		window.setTimeout(function(){
			toolboxMessageTop.innerHTML = ""
		}, 2000)
	}

	let toolboxCommand = function toolboxCommand(evt) {
		let command = evt.currentTarget.myParam

		let newCommand = "await page." + command
		if (command === 'waitFor') {
			newCommand += "(300)"
		} else if (command === 'type') {
			newCommand += "(\"" + document.getElementById("inputSelectedClass").value + "\", \"some text\", {delay: 20})"
		}
		else {
			newCommand += "(\"" + document.getElementById("inputSelectedClass").value + "\")"
		}

		let commandList = document.querySelector(".toolbox-markup__commands")
		if (commandList.innerHTML.length > 0) { commandList.innerHTML += "<br>" }
		commandList.innerHTML += newCommand
		commandList.scrollTop = commandList.scrollHeight
	}

	let toolboxCopyCommands = function toolboxCopyCommands() {
		let commandList = document.querySelector(".toolbox-markup__commands")
		let toolboxMessageBottom = document.querySelector(".toolbox-markup__message.-message-bottom")
		
		if (commandList.innerText.length > 0) {
			toolboxCopyStringToClipboard(commandList.innerText)
	
			toolboxMessageBottom.innerHTML = "commands copied to clipboard"
			window.setTimeout(function(){
				toolboxMessageBottom.innerHTML = ""
			}, 2000)
		} else {
			toolboxMessageBottom.innerHTML = "no commands to copy"
			window.setTimeout(function(){
				toolboxMessageBottom.innerHTML = ""
			}, 2000)
		}
	}

	let toolboxClearCommands = function toolboxClearCommands() {
		let commandList = document.querySelector(".toolbox-markup__commands")
		commandList.innerHTML = ""
	}

	let toolboxCopyStringToClipboard = function toolboxCopyStringToClipboard(str) {
		let el = document.createElement('textarea')
		el.value = str
		el.setAttribute('readonly', '')
		el.style.position = 'absolute'
		el.style.left = '-9999px'
		document.body.appendChild(el)
		el.select()
		document.execCommand('copy')
		document.body.removeChild(el)
	}

	script = document.createElement('script')
	script.innerHTML = toolboxMove + '\n' + toolboxClearClassList + '\n' + toolboxClose + '\n' + toolboxSelectClassListItem + '\n' + toolboxCommand + '\n' + toolboxCopyCommands + '\n' + toolboxClearCommands + '\n' + toolboxCopyStringToClipboard
	document.body.appendChild(script)

	//bind button actions
	document.getElementById("btnBivariateMoveLeft").addEventListener("click", toolboxMove)
	document.getElementById("btnBivariateMoveLeft").myParam = "left"

	document.getElementById("btnBivariateMoveRight").addEventListener("click", toolboxMove)
	document.getElementById("btnBivariateMoveRight").myParam = "right"

	document.getElementById("btnBivariateClearCLassList").addEventListener("click", toolboxClearClassList)
	document.getElementById("btnBivariateClose").addEventListener("click", toolboxClose)

	document.getElementById("btnBivariateToolboxCommandWaitForSelector").addEventListener("click", toolboxCommand)
	document.getElementById("btnBivariateToolboxCommandWaitForSelector").myParam = "waitForSelector"

	document.getElementById("btnBivariateToolboxCommandHover").addEventListener("click", toolboxCommand)
	document.getElementById("btnBivariateToolboxCommandHover").myParam = "hover"

	document.getElementById("btnBivariateToolboxCommandClick").addEventListener("click", toolboxCommand)
	document.getElementById("btnBivariateToolboxCommandClick").myParam = "click"

	document.getElementById("btnBivariateToolboxCommandFocus").addEventListener("click", toolboxCommand)
	document.getElementById("btnBivariateToolboxCommandFocus").myParam = "focus"

	document.getElementById("btnBivariateToolboxCommandType").addEventListener("click", toolboxCommand)
	document.getElementById("btnBivariateToolboxCommandType").myParam = "type"

	document.getElementById("btnBivariateToolboxCommandWaitFor").addEventListener("click", toolboxCommand)
	document.getElementById("btnBivariateToolboxCommandWaitFor").myParam = "waitFor"

	document.getElementById("btnBivariateToolboxCopyCommands").addEventListener("click", toolboxCopyCommands)
	document.getElementById("btnBivariateToolboxClearCommands").addEventListener("click", toolboxClearCommands)
}
