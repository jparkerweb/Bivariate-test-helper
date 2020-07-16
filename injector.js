// -----------------------------------------------------------------------------
// -- Bivariate Test Helper (Class List grabber / Puppeteer script generator) --
// -----------------------------------------------------------------------------
// console.log("theToolbox", theToolbox)
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
			width: 500px;
			height: 650px;
			border: 1px solid #888;
			color: #333;
			background: #efefef;
			border-radius: 4px;
			padding: 10px;
			text-align: left;
			display: flex;
			flex-direction: column;
			box-sizing: border-box;
			opacity: .875;
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
		.toolbox-markup--left {
			left: 5px;
		}
		.toolbox-markup--right {
			right: 5px;
		}

		.toolbox-markup button {
			text-transform: uppercase !important;
			margin-bottom: 6px !important;
			margin-right: 5px !important;
			background: #efefef !important;
			color: #333 !important;
			font-size: 11px !important;
			box-shadow: none !important;
			border: 1px solid #777 !important;
			padding: 0px 10px !important;
			height: 20px !important;
			max-height: 20px !important;
			line-height: 1 !important;
		}

		.toolbox-markup__message {
			margin-left: auto;
			color: maroon;
		}

		.toolbox-markup__class-list {
			flex: 1;
			overflow-y: auto;
			margin-bottom: 10px;
			padding: 5px;
			width: 100%;
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
			overflow-y: auto;
			overflow-x: auto;
			border: 1px solid #777;
			border-radius: 4px;
			background: #000;
			color: lightgreen;
			opacity: .9;
			padding: 5px;
			width: 100%;
			margin-bottom: 10px;
			white-space: nowrap;
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
			<div class="bivariate-tbm" style="display: flex;">
				<button type='button' class="bivariate-tbm toolbox-markup__move" onClick='toolboxMove("left")'>&lt;</button>
				<button type='button' class="bivariate-tbm toolbox-markup__move" onClick='toolboxMove("right")'>&gt;</button>
				<button type='button' class="bivariate-tbm toolbox-markup__button" onClick='toolboxClearClassList()'>clear</button>
				<button type='button' class="bivariate-tbm toolbox-markup__button" onClick='toolboxClose()'>close</button>
				<span class="bivariate-tbm toolbox-markup__message -message-top"><span>
			</div>
			<div class="bivariate-tbm toolbox-markup__class-list">` + toolboxMarkupClassListInstructions + `</div>
			<div class="bivariate-tbm" style="display: flex; flex-wrap: wrap;">
				<button type='button' class="bivariate-tbm toolbox-markup__command-button" onClick='toolboxCommand("waitForSelector")'>waitForSelector('.selector')</button>
				<button type='button' class="bivariate-tbm toolbox-markup__command-button" onClick='toolboxCommand("hover")'>hover('.selector')</button>
				<button type='button' class="bivariate-tbm toolbox-markup__command-button" onClick='toolboxCommand("click")'>click('.selector')</button>
				<button type='button' class="bivariate-tbm toolbox-markup__command-button" onClick='toolboxCommand("focus")'>focus('.selector')</button>
				<button type='button' class="bivariate-tbm toolbox-markup__command-button" onClick='toolboxCommand("type")'>type('.selector', 'some text')</button>
				<button type='button' class="bivariate-tbm toolbox-markup__command-button" onClick='toolboxCommand("waitFor")'>waitFor(300)</button>
			</div>
			<div class="bivariate-tbm toolbox-markup__divider"></div>
			<div class="bivariate-tbm toolbox-markup__commands"></div>
			<div class="bivariate-tbm" style="display: flex;">
				<button type='button' class="bivariate-tbm toolbox-markup__button" onClick="toolboxCopyCommands()">copy</button>
				<button type='button' class="bivariate-tbm toolbox-markup__button" onClick="toolboxClearCommands()">clear</button>
				<span class="bivariate-tbm toolbox-markup__message -message-bottom"><span>
			</div>
		</div>
	`

	document.body.innerHTML = document.body.innerHTML + toolboxMarkup

	let theToolbox = document.querySelector(".bivariate-tbm.toolbox-markup")
	let toolboxLastBivariateElementClassList = null
	let toolboxClassList = document.querySelector(".toolbox-markup__class-list")
	let toolboxClassListItemId = 0
	
	document.body.addEventListener("keydown", event => {
		event = event || window.event
		toolboxClassListItemId++
	
		if (event.code === 'KeyB' && toolboxLastBivariateElementClassList && !toolboxLastBivariateElementClassList.includes('bivariate-tbm') && !toolboxLastBivariateElementClassList.includes('toolbox-markup-target-outline--empty') && toolboxLastBivariateElementClassList !== "") {
			if (toolboxClassList.innerHTML === toolboxMarkupClassListInstructions) { toolboxClassList.innerHTML = "" }
	
			toolboxClassList.innerHTML += "<div class='bivariate-tbm toolbox-markup__class-list__item' onClick='toolboxSelectClassListItem(\"toolboxItem" + toolboxClassListItemId + "\", \"" + toolboxLastBivariateElementClassList + "\")' id='toolboxItem" + toolboxClassListItemId + "'>" + toolboxLastBivariateElementClassList + "</div>"
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
			// console.log("targetElm.classList", targetElm.classList)
			
			setTimeout(function(){ 
				targetElm.classList.remove(targetOutlineClass)
			}, targetOutlineTimeout)
		}
	}, false)


	let script = ""

	let toolboxMove = function toolboxMove(direction) {
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

		toolboxClassListItemSelected = ""
	}

	let toolboxClose = function toolboxClose() {
		let theToolbox = document.querySelector(".bivariate-tbm.toolbox-markup")
		theToolbox.classList.add('toolbox-markup-display--hide')
	}

	let toolboxSelectClassListItem = function toolboxSelectClassListItem(classListItemId, classListItemStr) {
		let currentlySelected = document.querySelector(".toolbox-markup__class-list__item--selected")
		if (currentlySelected) {currentlySelected.classList.remove("toolbox-markup__class-list__item--selected") }

		let toBeSelected = document.querySelector("#" + classListItemId)
		if (toBeSelected) { toBeSelected.classList.add("toolbox-markup__class-list__item--selected") }

		toolboxClassListItemSelected = classListItemStr
		toolboxCopyStringToClipboard(classListItemStr)

		let toolboxMessageTop = document.querySelector(".toolbox-markup__message.-message-top")
		toolboxMessageTop.innerHTML = "item class copied to clipboard"

		window.setTimeout(function(){
			toolboxMessageTop.innerHTML = ""
		}, 1500)
	}

	let toolboxCommand = function toolboxCommand(command) {
		let newCommand = "await page." + command
		if (command === 'waitFor') {
			newCommand += "(300)"
		} else if (command === 'type') {
			newCommand += "(\"" + toolboxClassListItemSelected + "\", \"some text\", {delay: 20})"
		}
		else {
			newCommand += "(\"" + toolboxClassListItemSelected + "\")"
		}

		let commandList = document.querySelector(".toolbox-markup__commands")
		if (commandList.innerHTML.length > 0) { commandList.innerHTML += "<br>" }
		commandList.innerHTML += newCommand
		commandList.scrollTop = commandList.scrollHeight
	}

	let toolboxCopyCommands = function toolboxCopyCommands() {
		let commandList = document.querySelector(".toolbox-markup__commands")
		toolboxCopyStringToClipboard(commandList.innerText)

		let toolboxMessageBottom = document.querySelector(".toolbox-markup__message.-message-bottom")
		toolboxMessageBottom.innerHTML = "command copied to clipboard"

		window.setTimeout(function(){
			toolboxMessageBottom.innerHTML = ""
		}, 1500)
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
}
