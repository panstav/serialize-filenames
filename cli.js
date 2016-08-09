#!/usr/bin/env node

const fs = require('fs');

const fileExtension = require('file-extension');
const padLeft = require('pad-left');

const argv = require('yargs')
	.usage('Usage: $ serialize-filenames [options]')
	.help('h')
	.alias('h', 'help')
	.wrap()
	.argv;

var filesToRename, numberOfDigits;

getFilenames()
	.then(renameFiles)
	.then(() => { console.log('Done'); })
	.catch(err => {
		console.error(err);
		console.error(err.stack);
	});

function getFilenames(){
	return new Promise((resolve, reject) =>{

		fs.readdir(process.cwd(), (err, paths) => {
			if (err) return reject(err);

			numberOfDigits = paths.length.toString().length;
			filesToRename = paths.filter(path => path.includes('.'));

			resolve();
		});

	});
}

function renameFiles(){

	return Promise.all(filesToRename.map(pathsToRenamePromises));

	function pathsToRenamePromises(path, index){
		return new Promise((resolve, reject) =>{

			const serial = padLeft(index, numberOfDigits, '0');
			const ext = fileExtension(path);

			fs.rename(`${process.cwd()}/${path}`, `${process.cwd()}/${serial}.${ext}`, err => {
				if (err) return reject(err);
				resolve();
			});

		});
	}

}