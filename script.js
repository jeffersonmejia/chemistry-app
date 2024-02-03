const d = document,
	$inputs = d.querySelectorAll('.group-input input')

let $focusedInput = null

function labelUp(label) {
	label.classList.add('label-up')
}

function labelDown(label) {
	label.classList.remove('label-up')
}

d.addEventListener('click', (e) => {
	if (e.target.matches('.group-input label')) {
		labelUp(e.target)
		$focusedInput = e.target

		const $inputGroup = e.target.parentElement,
			$input = $inputGroup.querySelector('input')
		$input.focus()
	}
	if (e.target.matches('.group-input input')) {
		const $inputGroup = e.target.parentElement,
			$label = $inputGroup.querySelector('label')
		$focusedInput = e.target
		labelUp($label)
	}
})

$inputs.forEach(($input) => {
	$input.addEventListener('blur', (e) => {
		const $inputGroup = e.target.parentElement,
			$label = $inputGroup.querySelector('label')
		labelDown($label)
	})
})
