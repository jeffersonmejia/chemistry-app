const d = document,
	$inputs = d.querySelectorAll('.group-input input'),
	$acidName = d.querySelector('.acid-form select'),
	$acidMolar = d.querySelector('.acid-form fieldset input'),
	$reactivesName = d.querySelectorAll('[data-reactive-name]'),
	$productNewIons = d.querySelectorAll('[data-new-ion]'),
	$dataMolarValues = d.querySelectorAll('[data-molar-value]'),
	$constantKAcidValues = d.querySelectorAll('[data-k-acid]'),
	$resultsMolarProduct = d.querySelectorAll('[data-result-molar-product]'),
	$sqrtResults = d.querySelectorAll('[data-sqrt-result]'),
	$section = d.querySelector('section'),
	$nextButton = d.querySelector('.next-step-button'),
	$noDataSection = d.querySelector('.no-data-section'),
	$procedureSection = d.querySelector('.procedure-container'),
	$molarInput = d.getElementById('molar-input'),
	$selectAcid = d.getElementById('select-acid')

const unicodeToDigitMap = {
	'⁰': 0,
	'¹': 1,
	'²': 2,
	'³': 3,
	'⁴': 4,
	'⁵': 5,
	'⁶': 6,
	'⁷': 7,
	'⁸': 8,
	'⁹': 9,
	'¯¹': -1,
	'¯²': -2,
	'¯³': -3,
	'¯⁴': -4,
	'¯⁵': -5,
	'¯⁶': -6,
	'¯⁷': -7,
	'¯⁸': -8,
	'¯⁹': -9,
	'¯⁹': -9,
	'¯¹⁰': -10,
	'¯¹¹': -11,
	'¯¹²': -12,
	'¯¹³': -13,
	'¯¹⁴': -14,
	'¯¹⁵': -15,
	'¯¹⁶': -16,
	'¯¹⁷': -17,
	'¯¹⁸': -18,
	'¯¹⁹': -19,
}

const digitMapToUnicodeReversed = {
	0: '⁰',
	1: '¹',
	2: '²',
	3: '³',
	4: '⁴',
	5: '⁵',
	6: '⁶',
	7: '⁷',
	8: '⁸',
	9: '⁹',
	'-1': '¯¹',
	'-2': '¯²',
	'-3': '¯³',
	'-4': '¯⁴',
	'-5': '¯⁵',
	'-6': '¯⁶',
	'-7': '¯⁷',
	'-8': '¯⁸',
	'-9': '¯⁹',
	'-10': '¯¹⁰',
	'-11': '¯¹¹',
	'-12': '¯¹²',
	'-13': '¯¹³',
	'-14': '¯¹⁴',
	'-15': '¯¹⁵',
	'-16': '¯¹⁶',
	'-17': '¯¹⁷',
	'-18': '¯¹⁸',
	'-19': '¯¹⁹',
}

let acidName = null,
	acidMolar = null,
	acidConstant = null

let $focusedInput = null

function labelUp(label) {
	label.classList.add('label-up')
	$focusedInput = label
}

function labelDown(label) {
	label.classList.remove('label-up')
}

function updateReaction() {
	$reactivesName.forEach(($reactive, index) => {
		$reactive.innerHTML = acidName
		if (index === 0) {
			$reactive.innerHTML += '⇆'
		}
	})
	updateIonsValue()
}

function updateIonsValue() {
	let hydrogenIons = acidName.match(/H(\d+)/),
		newIon = null
	if (hydrogenIons) {
		hydrogenIons = hydrogenIons[1]
	}
	if (hydrogenIons > 1) {
		newIon = acidName.replace(/H\d+/, '')
	} else {
		newIon = acidName.replace(/H+/, '')
	}
	$productNewIons.forEach(($ion, index) => {
		if (index < 1) {
			$ion.textContent = `+${newIon}`
		} else {
			$ion.textContent = `${newIon}`
		}
		if (!acidName.includes('⁻')) {
			$ion.textContent += '⁻'
		}
	})
}

function updateMolarValues() {
	$dataMolarValues.forEach(($molarEl) => {
		$molarEl.textContent = acidMolar
	})
}

function updateConstantKValues() {
	$constantKAcidValues.forEach(($elementK) => {
		$elementK.textContent = acidConstant
	})
}

function convertExponentUnicodeToNumber(exponentUnicode) {
	let result = parseInt(unicodeToDigitMap[exponentUnicode])
	return result
}

function formatScientificNotation(scientific) {
	const parts = scientific.toString().split('e'),
		integer = parts[0],
		exponent = parts[1],
		round = Math.round(integer * 1000) / 1000
	let newString = `${round}x10`
	if (digitMapToUnicodeReversed[exponent]) {
		newString += `${digitMapToUnicodeReversed[exponent]}`
	}
	return newString
}

function productConstantByMolar() {
	const exponentRegex = /x10(.+)/,
		exponentString = acidConstant.match(exponentRegex)[1],
		integerRegex = /^(.+?)x10/,
		integerNumber = parseFloat(acidConstant.match(integerRegex)[1]),
		exponent = convertExponentUnicodeToNumber(exponentString)
	let constantKAcid = (integerNumber * 10) ** exponent
	constantKAcid = constantKAcid.toExponential(2)

	let resultProduct = (constantKAcid * acidMolar).toExponential(3),
		resultScientific = formatScientificNotation(resultProduct)

	$resultsMolarProduct.forEach((result) => {
		result.innerText = resultScientific
	})
	// console.log(resultProduct)
	return resultProduct
}

function SQRTproduct(number) {
	const result = Math.sqrt(number).toExponential(3),
		sciencific = formatScientificNotation(result)
	$sqrtResults.forEach((el) => {
		el.innerText = sciencific
	})
	return result
}

function toggleSection() {
	$noDataSection.style.opacity = 0
	$procedureSection.style.opacity = 0
	setTimeout(() => {
		$noDataSection.classList.add('hidden')
		$procedureSection.classList.remove('hidden')
	}, 300)
	setTimeout(() => {
		$procedureSection.style.opacity = 1
	}, 400)
}

function calculateEquilibrium() {
	if ($acidName.value > 0 && $molarInput.value.length > 0) {
		toggleSection()
		const $acidNameSelected = $acidName.querySelector(
			`option[value="${$acidName.value}"]`
		)
		acidName = $acidNameSelected.dataset.form
		acidMolar = $acidMolar.value
		acidConstant = $acidNameSelected.dataset.acid
		updateReaction()
		updateIonsValue()
		updateMolarValues()
		updateConstantKValues()
		const resultProduct = productConstantByMolar()
		const SQRT = SQRTproduct(resultProduct)
	} else if ($selectAcid.value == 0) {
		$selectAcid.classList.add('shake')
	} else if (!$molarInput.value.length > 0) {
		$molarInput.classList.add('shake')
	}
	setTimeout(() => {
		$selectAcid.classList.remove('shake')
		$molarInput.classList.remove('shake')
	}, 700)
}
console.log($selectAcid.value)
d.addEventListener('click', (e) => {
	if (e.target.matches('#submit-acid-form')) {
		e.preventDefault()
		calculateEquilibrium()
	}
	if (e.target.matches('.group-input label')) {
		labelUp(e.target)

		const $inputGroup = e.target.parentElement,
			$input = $inputGroup.querySelector('input')
		$input.focus()
	}
	if (e.target.matches('.group-input input')) {
		const $inputGroup = e.target.parentElement,
			$label = $inputGroup.querySelector('label')
		labelUp($label)
	}
})

$inputs.forEach(($input) => {
	$input.addEventListener('blur', (e) => {
		const $inputGroup = e.target.parentElement,
			$label = $inputGroup.querySelector('label')
		if ($input.value.length < 1) labelDown($label)
	})
})
