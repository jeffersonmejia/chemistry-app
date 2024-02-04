const d = document,
	$inputs = d.querySelectorAll('.group-input input'),
	$acidName = d.querySelector('.acid-form select'),
	$acidMolar = d.querySelector('.acid-form fieldset input'),
	$reactivesName = d.querySelectorAll('[data-reactive-name]'),
	$productNewIons = d.querySelectorAll('[data-new-ion]'),
	$dataMolarValues = d.querySelectorAll('[data-molar-value]'),
	$constantKAcidValues = d.querySelectorAll('[data-k-acid]')

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
	}
	let result = parseInt(unicodeToDigitMap[exponentUnicode])
	return result
}

function productConstantByPolar() {
	const exponentRegex = /x10(.+)/,
		exponentString = acidConstant.match(exponentRegex)[1],
		integerRegex = /^(.+?)x10/,
		integerNumber = parseInt(acidConstant.match(integerRegex)[1]),
		exponent = convertExponentUnicodeToNumber(exponentString)
	const molarValue = Math.pow(integerNumber * 10, exponent)
	console.log(molarValue)
	// const result  =  acidMolar
}

function calculateEquilibrium() {
	if ($acidName.value > 0) {
		const $acidNameSelected = $acidName.querySelector(
			`option[value="${$acidName.value}"]`
		)
		acidName = $acidNameSelected.dataset.form
		acidMolar = $acidMolar.value
		acidConstant = $acidNameSelected.dataset.acid
	}
	updateReaction()
	updateIonsValue()
	updateMolarValues()
	updateConstantKValues()
	productConstantByPolar()
}

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
