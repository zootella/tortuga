console.log("page.js\\");
console.log(`process.pid ${process.pid}
__filename ${__filename}
__dirname  ${__dirname}`);

const {runByNode, runByElectron, runByElectronMain, runByElectronRenderer} = require("./main-library.js");
const {appendHead, tag, idn, PageText, getFrameLog, setFrameLog} = require("./page-library.js");

var pageTag = tag("<pageTag>", {
	properties: ["m"],
	template: `
		<div>
			<p>
				<button @click="m.refresh">Browser Refresh</button>
				<button @click="m.openDevTools">Open Dev Tools</button>
				<button @click="m.toggleFrameLog">{{ m.toggleText }}</button>
			</p>
			<p>
				<button @click="m.demo1">Demo 1</button>
				<button @click="m.demo2">Demo 2</button>
				<button @click="m.demo3">Demo 3</button>
				<button @click="m.demo4">Demo 4</button>
				<button @click="m.demo5">Demo 5</button>
				<button @click="m.demo6">Demo 6</button>
				<button @click="m.demo7">Demo 7</button>
				<button @click="m.demo8">Demo 8</button>
			</p>
			<div>
				<frameTag v-for="(n, index) in m.frameList" :key="n.id" :m="n" :i="index"></frameTag>
			</div>
		</div>
	`,
	make() {
		var m = {
			id: idn(),
			frameList: [],
			toggleText: buttonText(),
			refresh() {
				window.location.reload();
			},
			openDevTools() {
				//TODO replace this horrible hack, here temporarily for convenience, with an actual understanding of IPC in Electron
				require("electron").remote.BrowserWindow.getAllWindows()[0].openDevTools();
			},
			toggleFrameLog() {
				setFrameLog(!getFrameLog());//toggle the logs on or off
				m.toggleText = buttonText();//say what the button does next
			},
			demo1() { m.frameList.push(frameTag.make(m, "demo1", demo1Tag.make())); },//pass in this model m as the new frame's container
			demo2() { m.frameList.push(frameTag.make(m, "demo2", demo2Tag.make())); },
			demo3() { m.frameList.push(frameTag.make(m, "demo3", demo3Tag.make())); },
			demo4() { m.frameList.push(frameTag.make(m, "demo4", demo4Tag.make())); },
			demo5() { m.frameList.push(frameTag.make(m, "demo5", demo5Tag.make())); },
			demo6() { m.frameList.push(frameTag.make(m, "demo6", demo6Tag.make())); },
			demo7() { m.frameList.push(frameTag.make(m, "demo7", demo7Tag.make())); },
			demo8() { m.frameList.push(frameTag.make(m, "demo8", demo8Tag.make())); },
			removeFrameAtIndex(i) {//a frame at index i is telling us to remove it
				m.frameList.splice(i, 1);
			}
		}
		function buttonText() {
			if (getFrameLog()) return "Stop logging milliseconds between frames";//it's on, button turns it off
			else               return "Log milliseconds between frames";//it's off, button turns it on
		}
		return m;
	}
});
var page = pageTag.make();

var frameTag = tag("<frameTag>", {
	properties: ["m", "i"],
	template: `
			<div class="box">
				<button @click="m.close(i)">Close</button>
				<demo1Tag v-if="m.demoName == 'demo1'" :key="m.demoModel.id" :m="m.demoModel"></demo1Tag>
				<demo2Tag v-if="m.demoName == 'demo2'" :key="m.demoModel.id" :m="m.demoModel"></demo2Tag>
				<demo3Tag v-if="m.demoName == 'demo3'" :key="m.demoModel.id" :m="m.demoModel"></demo3Tag>
				<demo4Tag v-if="m.demoName == 'demo4'" :key="m.demoModel.id" :m="m.demoModel"></demo4Tag>
				<demo5Tag v-if="m.demoName == 'demo5'" :key="m.demoModel.id" :m="m.demoModel"></demo5Tag>
				<demo6Tag v-if="m.demoName == 'demo6'" :key="m.demoModel.id" :m="m.demoModel"></demo6Tag>
				<demo7Tag v-if="m.demoName == 'demo7'" :key="m.demoModel.id" :m="m.demoModel"></demo7Tag>
				<demo8Tag v-if="m.demoName == 'demo8'" :key="m.demoModel.id" :m="m.demoModel"></demo8Tag>
			</div>
		`,
	make(pageModel, demoName, demoModel) {
		var m = {
			id: idn(),

			pageModel: pageModel,
			demoName: demoName,
			demoModel: demoModel,

			made: Date.now()+"",
			close(i) {
				pageModel.removeFrameAtIndex(i);
			}
		};
		return m;
	}
});

var demo1Tag = tag("<demo1Tag>", {
	properties: ["m", "i"],
	template: `
			<div>
				<p>Demo 1: Goals</p>
				<ol>
					<li>It's easy to make, find, and change UI components.</li>
					<li>You can see a template and its model together, and the code fits without scrolling.</li>
					<li>Page status updates at 60 Hz, and never slows down the process or I/O, even with thousands of elements.</li>
					<li>Code file structure isn't tied to window and component structure, and windows and components aren't singletons.</li>
					<li>Multiple windows are easy, even if most of the UI happens in a main window.</li>
					<li>A single style sheet defines the look and feel of the entire app.</li>
				</ol>
			</div>
		`,
	make() {
		var m = {
			id: idn()
		};
		return m;
	}
});

var demo2Tag = tag("<demo2Tag>", {
	properties: ["m", "i"],
	template: `
			<div>
				<p>Demo 2: Click a button to change some text on the page.</p>
				<p><button @click="m.method1">Change Message</button></p>
				<p>{{ m.message }}</p>
			</div>
		`,
	make() {
		var m = {
			id: idn(),
			message: "Starting message",
			method1() {
				m.message = "Updated message";
			}
		};
		return m;
	}
});

var demo3Tag = tag("<demo3Tag>", {
	properties: ["m", "i"],
	template: `
			<div>
				<p>Demo 3: Create and change a list of items.</p>
				<p>
					<button @click="m.method1">Add 5</button>
					<button @click="m.method2">Remove Start</button>
					<button @click="m.method3">Remove Middle</button>
					<button @click="m.method4">Remove End</button>
				</p>
				<item3Tag v-for="(n, index) in m.a" :key="n.id" :m="n" :i="index"></item3Tag>
			</div>
		`,
	make() {
		var m = {
			id: idn(),
			a: [],
			method1() { for (var i = 0; i < 5; i++) m.a.push(item3Tag.make("hello")); },
			method2() { m.a.splice(0, 1); },
			method3() { m.a.splice(m.a.length / 2, 1); },
			method4() { m.a.splice(m.a.length - 1, 1); }
		};
		return m;
	}
});

var item3Tag = tag("<item3Tag>", {
	properties: ["m", "i"],
	template: `
			<div>
				index{{ i }}:
				This is an item with id "{{ m.id }}",
				timestamp "{{ m.made }}",
				and message "{{ m.message }}"
			</div>
		`,
	make(message) {
		var m = {
			id: idn(),
			made: Date.now()+"",
			message: message
		};
		return m;
	}
});

var demo4Tag = tag("<demo4Tag>", {
	properties: ["m", "i"],
	template: `
			<div>
				<p>Demo 4: Change the items in a list and sort them.</p>
				<p>
					<button @click="m.method1">Add 5</button>
					<button @click="m.method2">Remove Start</button>
					<button @click="m.method3">Remove Middle</button>
					<button @click="m.method4">Remove End</button>
					<button @click="m.method5">Sort ▲</button>
					<button @click="m.method6">Sort ▼</button>
				</p>
				<item4Tag v-for="(n, index) in m.a" :key="n.id" :m="n" :i="index"></item4Tag>
			</div>
		`,
	make() {
		var m = {
			id: idn(),
			a: [],
			method1() { for (var i = 0; i < 5; i++) m.a.push(item4Tag.make(m, "hello")); },
			method2() { m.a.splice(0, 1); },
			method3() { m.a.splice(m.a.length / 2, 1); },
			method4() { m.a.splice(m.a.length - 1, 1); },
			method5() { m.a.sort(function(a, b) { return a.count - b.count }); },
			method6() { m.a.sort(function(a, b) { return b.count - a.count }); }
		};
		return m;
	}
});

var item4Tag = tag("<item4Tag>", {
	properties: ["m", "i"],
	template: `
		<div class="grayBox">
			index{{ i }},
			{{ m.id }},

			<button @click="m.remove(i)">Remove</button>,
			{{ m.made }} <button @click="m.update">Update</button>,
			{{ m.count }} <button @click="m.increment">Increment</button>,

			<input type="text" :value="m.inputCurrent" @input="m.onInput($event)" ref="inputReference"/>
			<button @click="m.onSet($refs)">Set</button>
			"{{ m.inputSet }}"
		</div>
	`,
	make(up, inputArgument) {
		var m = {
			id: idn(),
			up: up,

			remove(i) { m.up.a.splice(i, 1); },

			made: Date.now()+"",
			update() { m.made = Date.now()+""; },

			count: 0,
			increment() { m.count++; },

			inputCurrent: inputArgument,
			inputSet: "",
			onInput(e) {//called when the user types
				var currentText = e.target.value;
				m.inputCurrent = currentText;//manually update the model
			},
			onSet(r) {
				var currentText = r.inputReference.value;
				m.inputSet = currentText;
			}
		};
		return m;
	}
});

var demo5Tag = tag("<demo5Tag>", {
	properties: ["m", "i"],
	template: `
			<div>
				<p>Demo 5: Automatic and traditional form fields.</p>
				<p>
					<button @click="m.method1(2)">Add Some</button>
					<button @click="m.method2">Remove Start</button>
					<button @click="m.method3">Remove Middle</button>
					<button @click="m.method4">Remove End</button>
					<button @click="m.method5">Sort ▲</button>
					<button @click="m.method6">Sort ▼</button>
				</p>
				<item5Tag v-for="(n, index) in m.a" :key="n.id" :m="n" :i="index"></item5Tag>
			</div>
		`,
	make() {
		var m = {
			id: idn(),
			a: [],
			method1(n) { for (var i = 0; i < n; i++) m.a.push(item5Tag.make(m, "start 1", "start 2", "start 3")); },
			method2() { m.a.splice(0, 1); },
			method3() { m.a.splice(m.a.length / 2, 1); },
			method4() { m.a.splice(m.a.length - 1, 1); },
			method5() { m.a.sort(function(a, b) { return a.count - b.count }); },
			method6() { m.a.sort(function(a, b) { return b.count - a.count }); }
		};
		return m;
	}
});

var item5Tag = tag("<item5Tag>", {
	properties: ["m", "i"],
	template: `
		<div class="thinBox">
			<p>
				index{{ i }},
				{{ m.id }},
				<button @click="m.remove(i)">Remove</button>,
				{{ m.made }} <button @click="m.update">Update</button>,
				{{ m.count }} <button @click="m.increment">Increment</button>
			</p>

			<p>input1
			<input type="text" v-model="m.input1model" @input="m.input1onInput" placeholder="placeholder 1"/>
			"{{ m.input1model }}"</p>

			<p>input2
			<input type="text" :value="m.input2model" @input="m.input2onInput($event)" placeholder="placeholder 2"/>
			"{{ m.input2model }}"</p>

			<p>input3
			<input type="text" :value="m.input3model" @input="m.input3onInput($event)" placeholder="placeholder 3" ref="input3reference"/>
			"{{ m.input3model }}"
			<button @click="m.input3onClick($refs)">Set</button>
			"{{ m.input3set }}"</p>
		</div>
	`,
	make(up, input1start, input2start, input3start) {
		var m = {
			id: idn(),
			up: up,
			remove(i) { m.up.a.splice(i, 1); },
			made: Date.now()+"",
			update() { m.made = Date.now()+""; },
			count: 0,
			increment() { m.count++; },

			//input1: automatic model, stays in sync by itself, and we can still get called when it changes
			input1model: input1start,
			input1onInput() {
				var s = m.input1model;
				console.log(`input 1 current text "${s}"`);
			},

			//input2: same thing but hooked up manually, now we get the current text from the event
			input2model: input2start,
			input2onInput(e) {//called when the user types
				var s = e.target.value;
				m.input2model = s;//manually update the model
			},

			//input3: more like a traditional form with a Set button
			input3model: input3start,
			input3set: "",
			input3onInput(e) {//called when the user types
				var s = e.target.value;
				m.input3model = s;//manually update the model
			},
			input3onClick(r) {
				var s = r.input3reference.value;
				m.input3set = s;
			}
		};
		return m;
	}
});

var demo6Tag = tag("<demo6Tag>", {
	properties: ["m", "i"],
	template: `
			<div>
				<p>Demo 6: Different ways to slow an immediate loop down.</p>
				<p>setImmediate:</p>
				<p><button @click="m.runOnce">1. setImmediate, update once</button> {{ m.countOnce }}</p>
				<p><button @click="m.runEvery">2. setImmediate, update every time</button> {{ m.countEvery }}</p>
				<p><button @click="m.runFrame">3. setImmediate, update every requestAnimationFrame</button> {{ m.countFrame }}</p>
				<p>clocks:</p>
				<p><button @click="m.runThousand">4. millisecond clock, updates every time</button> {{ m.clockThousand }} {{ m.countThousand }}</p>
				<p><button @click="m.runTenEvery">5. tenths of second clock, updates every time</button> {{ m.clockTenEvery }} {{ m.countTenEvery }}</p>
				<p><button @click="m.runTenDifferent">6. tenths of second clock, updates when different</button> {{ m.clockTenDifferent }} {{ m.countTenDifferent }}</p>
				<p>using <i>PageText</i>:</p>
				<p><button @click="m.runProgress">7. setImmediate, update progress every time</button> {{ m.countProgress.v }}</p>
				<p>
					1 is how fast setImmediate can go when it doesn't touch Vue or the DOM at all.<br/>
					Only hitting Vue and the DOM on requestAnimationFrame, 3 is nearly as fast.<br/>
					2 is slow, so you do need to use requestAnimationFrame.
				</p>
				<p>
					4, 5, and 6 are all fast enough.<br/>
					You don't have to guard against repeatedly setting the same value into a variable Vue is watching.
				</p>
				<p>
					Why is 4 faster than 2?<br/>
					2 sets a new value (a higher count) every time it runs.<br/>
					4 only has a new value (the time in milliseconds) 1000 times during the second it runs.
				</p>
				<p>
					7 only updates on a frame like 3, and only when different like 6.<br/>
					Using <i>PageText</i>'s .updateProgress() method, the code is as simple as 2 without being much slower than 1.
				</p>
			</div>
		`,
	make() {
		var m = {
			id: idn(),

			// 1. setImmediate, update once
			countOnce: 0, runOnce() {
				var count = 0;
				var start = Date.now();
				f();
				function f() {
					if (Date.now() < start + 1000) {
						count++;
						setImmediate(f);
					} else {
						m.countOnce = count;
					}
				}
			},

			// 2. setImmediate, update every time
			countEvery: 0, runEvery() {
				var count = 0;
				var start = Date.now();
				f();
				function f() {
					if (Date.now() < start + 1000) {
						count++;
						m.countEvery = count+"";
						setImmediate(f);
					}
				}
			},

			// 3. setImmediate, update every requestAnimationFrame
			countFrame: 0, runFrame() {
				var count = 0;
				var start = Date.now();
				f();
				g();
				function f() {
					count++;
					if (Date.now() < start + 1000) {
						setImmediate(f);
					}
				}
				function g() {
					m.countFrame = count;
					if (Date.now() < start + 1000) {
						requestAnimationFrame(g);
					}
				}
			},

			// 4. millisecond clock, updates every time
			clockThousand: "", countThousand: 0, runThousand() {
				var count = 0;
				var start = Date.now();
				f();
				function f() {
					if (Date.now() < start + 1000) {
						m.clockThousand = (new Date()).getTime();
						count++;
						setImmediate(f);
					} else {
						m.countThousand = count;
					}
				}
			},

			// 5. tenths of second clock, updates every time
			clockTenEvery: "", countTenEvery: 0, runTenEvery() {
				var count = 0;
				var start = Date.now();
				f();
				function f() {
					if (Date.now() < start + 1000) {
						m.clockTenEvery = ((new Date()).getTime()+"").slice(0, -2);
						count++;
						setImmediate(f);
					} else {
						m.countTenEvery = count;
					}
				}
			},

			// 6. tenths of second clock, updates when different
			clockTenDifferent: "", countTenDifferent: 0, runTenDifferent() {
				var count = 0;
				var start = Date.now();
				var onScreen = "";
				f();
				function f() {
					if (Date.now() < start + 1000) {
						var s = ((new Date()).getTime()+"").slice(0, -2);
						if (onScreen != s) {
							onScreen = s;
							m.clockTenDifferent = s;
						}
						count++;
						setImmediate(f);
					} else {
						m.countTenDifferent = count;
					}
				}
			},

			// 7. setImmediate, update progress every time
			countProgress: PageText(0+""), runProgress() {
				var count = 0;
				var start = Date.now();
				f();
				function f() {
					if (Date.now() < start + 1000) {
						count++;
						m.countProgress.updateProgress(count+"");
						setImmediate(f);
					}
				}
			}
		};
		return m;
	}
});

var powerOption;

var demo7Tag = tag("<demo7Tag>", {
	properties: ["m", "i"],
	template: `
			<div>
				<p>Demo 7: Too many counters.</p>
				<p>
					<input type="text" value="50" ref="inputReference"/>
					<button @click="m.more($refs)">More</button>
					<button @click="m.less($refs)">Less</button>
					<button @click="m.demi">Demi</button>
					<button @click="m.clear">Clear</button>
					<button @click="m.power">{{ m.powerButton.v }}</button>
				</p>
				<p>
					{{ m.counters.length }} counters:
				</p>
				<counter7Tag v-for="(n, index) in m.counters" :key="n.id" :m="n" :i="index"></counter7Tag>
				<p>
					Using frame keeps the page from slowing down the program as a whole.
					To see this in action, turn off the log, hide the developer tools, add 50 counters.
					On frame, you can count up with the thousands.
					On force, you can count up with the hundreds.
				</p>
				<p>
					The log only changes once a second, but you've seen this slow down the page.
					With around 600 counters, the first frame in a new log may be repeatedly slow, because the last log happened.
					So, turn off logging to see the real behavior.
				</p>
				<p>
					On frame, 800 counters are fast all the time, 1600 are slow all the time.
					Quantities in between exhibit transitions between the two speeds.
				</p>
				<p>
					Updating 1600 counters causes the next frame to arrive in about 30ms.
					With the log on, using frame, you can see the frame every 800ms that takes this long.
					And since there's always one of those in the last second, the page stays in slow mode.
				</p>
				<p>
					Around 900 counters, you've seen a weird hiccup-step.
					Two updates happen one quickly after the other (not a burst of fast), followed correctly by some slow mode.
					Bursts of fast admid slow are ok, but there shouldn't be a hiccup.
					So not sure what that is, but also not very important.
				</p>
				<p>
					Using frame, try clicking the taskbar to minimize and restore the window.
					Try dragging to change the width of the window, including just holding the mouse down as <-> without moving it.
					Interesting but not incorrect behaviors.
				</p>
			</div>
		`,
	make() {
		var m = {
			id: idn(),
			counters: [],
			more(r) {//add more counters to the start
				var n = r.inputReference.value;//get the number typed in the text field on the page
				var a = [];
				for (var i = 0; i < n; i++) a.push(counter7Tag.make(m));//array of new counters
				m.counters = a.concat(m.counters);//add them to the start
			},
			less(r) {//remove counters from the middle
				var n = r.inputReference.value;
				remove(n);
			},
			demi() {//remove the middle half
				var n = Math.floor(m.counters.length / 2);
				if (n == 0) n = 1;
				remove(n);
			},
			clear() {//get rid of all the counters
				m.counters = [];
			},

			powerOption: false,//false is frame, true is force
			powerButton: PageText("Frame (switch to force)"),
			power() {
				m.powerOption = !m.powerOption;
				m.powerButton.update(m.powerOption ? "Force (switch to frame)" : "Frame (switch to force)");
			}
		};

		function remove(n) {//remove n counters from the middle
			if (n >= m.counters.length) {
				m.counters = [];
			} else {
				var start = Math.floor(n / 4);
				m.counters.splice(start, n);
			}
		}

		//as fast as setImmediate can spin, increment all the counters in the array
		function immediateLoop() {
			for (var i = 0; i < m.counters.length; i++) m.counters[i].increment();
			setImmediate(immediateLoop);
		}
		immediateLoop();

		return m;
	}
});

var counter7Tag = tag("<counter7Tag>", {
	properties: ["m", "i"],
	template: `<span>[{{ m.face.v }}] </span>`,
	make(up) {
		var m = {
			id: idn(),
			up: up,
			count: 0,
			face: PageText("0"),
			increment() {
				m.count++;
				var s = m.count+"";
				if (up.powerOption) m.face.update(s);
				else                m.face.updateProgress(s);
			},
		};
		return m;
	}
});

var demo8Tag = tag("<demo8Tag>", {
	properties: ["m", "i"],
	template: `
			<div>
				<p>Demo 8: Nothing here yet.</p>
			</div>
		`,
	make() {
		var m = {
			id: idn()
		};
		return m;
	}
});

console.log("page.js/");
