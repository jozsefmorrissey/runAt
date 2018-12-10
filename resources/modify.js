		var app = angular.module('myApp', []);

		function iterate(func) {
			for (let index = 0; index < this.length; index += 1) {
				func.call(this[index]);			
			}		
		}
		
		function iterateObj(obj, func) {
			const keys = Object.keys(obj);
			for (let index = 0; index < keys.length; index ++ ){
				func.call(obj[keys[index]], keys[index]);
			}
		}

		Array.prototype.each = iterate;		
		
		app.controller('myCtrl', function($scope, $http, $timeout) {
			$scope.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
			$scope.fiveMinSpace = new Array(288);
			$scope.cmds = [];
			$scope.times = Object.keys(Array.apply(null, Array(24)));
			let sectionId;
			$scope.colors = {
				Limegreen: '32CD32',
				Blue: '0000FF',
				Red: 'FF0000',
				Skyblue: '87CEEB',
				Orange: 'FFA500',
				Hotpink: 'FF69B4',
				Purple: '800080',
				Darkslateblue: '483D8B',
				Gold: 'FFD700',
				Darkgreen: '006400',
				Violet: 'EE82EE',
				Aqua: '00FFFF',
				Greenyellow: 'ADFF2F',
				Aquamarine: '7FFFD4',
				Lavenderblush: 'FFF0F5',
			};
			
			function positionElementOnElement(floating, target, css) {
				const offset = target.offset();
				const height = target.height();
				const screenWidth = $(window).width();
				const top = `${offset.top - floating.height()}px`;
				const left = offset.left - (floating.width() / 2) + (target.width() / 2);
				
				floating.css({ left, top });
			}
			
			function update(res) {
				data = res.data;
				$scope.excludedSections = [];

				if (data === undefined) {
					$scope.cmds = [];				
				} else {
					$scope.cmds = data;
				}
				
				for (let sIndex = 0; sIndex < $scope.cmds.length; sIndex += 1) {
					const cmd = $scope.cmds[sIndex];
					const times = cmd.times;
					const tKeys = Object.keys(times);
					for (let kIndex = 0; kIndex < tKeys.length; kIndex += 1) {
						const timeList = times[tKeys[kIndex]];
						const dates = [];
						const secKey = tKeys[kIndex];
						days = secKey.split('-');
						if (!getSection(secKey)) {
							addSection(secKey, days);
						}
					 	for (let tIndex = 0; tIndex < timeList.length; tIndex += 1) {
							let dateObj = JSON.parse(JSON.stringify(timeList[tIndex]));
					 		if (days[0] === dateObj.day) {
								dateObj = new ItDate(dateObj);
								dates.push(new Date(dateObj.toString()));
							}
				 		}
				 		times[tKeys[kIndex]] = dates;
					}
				}

				delayUpdateVisual();
			}
			
			function setList(res) {
				$scope.idList = res.data;
				$scope.selectedId = $scope.idList[0];
				get($scope.idList[0]);
			}
			
			function get(id) {
				$scope.selectedId = id;
				$http.get(`http:\/\/localhost:3000/${id}`).then(update);
			}
			
			function delayUpdateVisual(section) {
				$timeout(function () {updateVisual(section);}, 100);
			}

			$http.get('http://localhost:3000/id/list').then(setList);
			let dummyId = 0;
			function addSection(sectionId, days) {
				if (sectionId === undefined) {
					sectionId = `${dummyId++}`;
					days = [];
				}
				const section = {id: sectionId, days};
				$scope.excludedSections.push(section);
				$timeout(function () {updateVisual(section);}, 250);
			}
			
			function getSection(key) {
				let section;
				for (let index = 0; index < $scope.excludedSections.length; index += 1) {				
					const currSec = $scope.excludedSections[index];
					if(currSec.id === key) {
						section = currSec;
					}
				}
				return section;
			}
			
			function saveIt(id) {
				const itCmdDates = JSON.parse(JSON.stringify($scope.cmds));
				let count = 0;
				$scope.cmds.each(function() {
					itCmdDates[count].times = {};
					iterateObj(this.times, function (key) {
						for (let index = 0; index < this.length; index += 1) {
							const hour = this[index].getHours();
							const min = this[index].getMinutes();
							const section = getSection(key);
							const tKey = section.days.join('-');
							if (itCmdDates[count].times[tKey] === undefined) {
                       itCmdDates[count].times[tKey] = [];							
							}
							for (let dIndex = 0; dIndex < section.days.length; dIndex += 1) {
								itCmdDates[count].times[tKey].push(new ItDate(null, null, section.days[dIndex], hour, min, 0, 0).toObj());						
							}
						}
					});
					count += 1;
				});
				console.log(itCmdDates);
				const data = {};
				$http.post(`/save/${id}`, itCmdDates);
			}
			
			function setDays() {
				for (let index = 0; index < $scope.excludedSections.length; index += 1) {
					const section = $scope.excludedSections[index];
					section.days = [];
					$(`#section-${section.id}`)
						.find('input[type=checkbox]:checked')
						.each(function () {
							section.days.push($(this).attr('day'));
						});
				}
			}
	
			function sortTimes() {
				$scope.cmds.each(function() {
					iterateObj(this.times, function () {
						this.sort(function (d1, d2) {return (d1.getHours() * 60 + d1.getMinutes()) - (d2.getHours() * 60 + d2.getMinutes());});
					});
				});
			}

			function save(id) {
				setDays();
				sortTimes();
				saveIt(id);	
			}

			function addCmdTime(cmd, sectionId) {
				if (cmd.times === undefined) {
					cmd.times = {};				
				}
				if (cmd.times[sectionId] === undefined) {
					cmd.times[sectionId] = [];				
				}
				cmd.times[sectionId].push(new Date(1970, 0, 1, 0, 0, 0 ));
			}
			
			function getTimeBlocks(func) {
				const timeBlocks = {};
				for (let index = 0; index < $scope.excludedSections.length; index += 1) {
					const section = $scope.excludedSections[index];
					const timeBlock = $(`#section-${section.id}`).find('.time-block');
					if (func) {func(timeBlock);}
					timeBlocks[section.id] = timeBlock;
				}
				return timeBlocks;
			}
			
			function clearAlias(timeBlock) {
				timeBlock.each(function () {$(this).attr('cmd-alias', '');});
			}

			function updateVisual() {
				const timeBlocks = getTimeBlocks(clearAlias);
				for (let sIndex = 0; sIndex < $scope.cmds.length; sIndex += 1) {
					const cmd = $scope.cmds[sIndex];
					const times = cmd.times;
				   const keys = Object.keys(cmd.times);
				   for (let kIndex = 0; kIndex < keys.length; kIndex += 1) {
						const tKey = keys[kIndex];
				   	const timeList = cmd.times[tKey];
  				 		for (let tIndex = 0; tIndex < timeList.length; tIndex += 1) {
							setAlias(timeBlocks[tKey], cmd, timeList[tIndex]);
						}
					}
				}
				$scope.excludedSections.each(colorBlocks);
				$scope.excludedSections.each(setLabels);
			}

			// TODO: test.
			function setAlias (jqObj, cmd, date) {
				const cmdPos = Number.parseInt((date.getHours() * 12) + (date.getMinutes() / 5));
				const currAlias = $(jqObj[cmdPos]).attr('cmd-alias');
				if (currAlias) {
					$(jqObj[cmdPos]).attr('cmd-alias', `${currAlias},${cmd.alias}`);								
				} else {
					$(jqObj[cmdPos]).attr('cmd-alias', cmd.alias);
				}
			}

			// TODO: write need to loop over all blocks. / make function to place scale... loop by increments of 15
			function colorBlocks() {
				const jqObj = $(`#section-${this.id}`);
				let colors;
				let colorIndex;
				jqObj.find('.time-block').each(function () {
					const aliasList = $(this).attr('cmd-alias')
					if (aliasList !== undefined && aliasList !== '') {
						const aliases = aliasList.split(',');
						colors = [];
						colorIndex = 0;
						$scope.cmds.each(function () {
							if (aliases.indexOf(this.alias) !== -1) {
								colors.push(this.selectedColor);							
							}
						});
					}
					if (colors) {
						$(this).css({'background-color': colors[colorIndex]});
						colorIndex = (colorIndex + 1) % colors.length;
					} else {
						$(this).css({'background-color': 'black'});
					}
				});
			}
		
			function setLabels() {
					const jqObj = $(`#section-${this.id}`);
					for (let index = 0; index < 288; index += 3) {
						const hour = Number.parseInt(index / 12);
						const target = jqObj.find(`#time-block-${index}`);
						if (index % 12 === 0) {
							const floater = jqObj.find(`#time-${hour}`);
							positionElementOnElement(floater, target);
						} else if (index % 12 === 6) {
							const floater = jqObj.find(`#time-${hour}-5`);
							positionElementOnElement(floater, target);
						} else if (index % 12 === 9) {
							const floater = jqObj.find(`#time-${hour}-75`);
							positionElementOnElement(floater, target);
						} else if (index % 12 === 3) {
							const floater = jqObj.find(`#time-${hour}-25`);
							positionElementOnElement(floater, target);
						}
					}
			}
			
			function addNewId(newId) {
				$scope.idList.push(newId);
				$scope.addNew = false;
			}
			
			function removeTime(section, index) {
				section.times.splice(index, 1);
				updateVisual(section);
				if (section.times.length === 0 ) {
					const len = $scope.excludedSections.length;
					for (let index = 0; index < len; index += 1) {
						if ($scope.excludedSections[index].id === section.id) {
							$scope.excludedSections.splice(index, 1);
						}
					}
				}
			}
			
			function toggleAddNew() {
				$scope.addNew = !$scope.addNew;
			}
			
			function getNonSelectedColor() {
				const usedColors = $scope.cmds.map(a => a.selectedColor);
				const keys = Object.keys($scope.colors);
				for (let index = 0; index < keys.length; index += 1) {
					const color = $scope.colors[keys[index]];
					if (usedColors.indexOf(color) === -1) {
						return color;
					}				
				}
				return undefined;
			}
		
			function addCmd() {
				if ($scope.cmds === undefined) {
					$scope.cmds = [];		
				}
				$scope.cmds.push({selectedColor: getNonSelectedColor(), times: []});
				delayUpdateVisual();
			} 
			
			function removeSection(section) {}
			
			$scope.toggleAddNew = toggleAddNew;
			$scope.addNew = false;
			$scope.addNewId = addNewId;
			$scope.save = save;
			$scope.removeTime = removeTime;
			$scope.removeSection = removeSection;
			$scope.updateVisual = updateVisual;
			$scope.addSection = addSection;
			$scope.get = get;
			$scope.addCmd = addCmd;
			$scope.addCmdTime = addCmdTime;
		});
		
