import removeCircleSVG from '../img/remove_circle_outline-24px.svg';

const DataURL = {
	'remove_circle_outline-24px.svg': removeCircleSVG,
}

const Images = new Map();

export async function getImg(name) {
	if (Images.has(name)) {
		return Images.get(name)
	}

	let promise = new Promise(async resolve => {
		let res = await fetch(DataURL[name]);
		resolve(await res.text());
	});

	Images.set(name, promise);
	return promise;
}
