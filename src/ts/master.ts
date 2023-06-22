import * as M from 'materialize-css';
import * as $ from 'jquery';

M.Sidenav.init(document.querySelectorAll('.sidenav'));
(window as any).JQ = $;

const leftTransition = "left .4s cubic-bezier(.76,-0.48,.32,1.44) .07s, right .4s cubic-bezier(.76,-0.48,.32,1.44) .01s";
const rightTransition = "left .4s cubic-bezier(.76,-0.48,.32,1.44) .01s, right .4s cubic-bezier(.76,-0.48,.32,1.44) .07s";

$('body').on('click', '.auditory', showRoute);
$('body').on('click', '#lang-switcher', switchLanguage);

(() => {
	document.querySelectorAll('.tab').forEach(el => {el.querySelector('a').addEventListener('click', tabClick);})
	window.addEventListener('resize', updateIndicator);
	let resizeEvent = new Event('resize');
	window.dispatchEvent(resizeEvent);

	initLanguage();
})();

function showRoute(e:JQuery.ClickEvent)
{
	e.preventDefault();
	let el = <HTMLElement>e.currentTarget;
	let room  = el.dataset['room'] || '';
	let room_id = el.dataset['id'] || '';
	let newClass = $(el).hasClass('active') ? '' : 'active';
	let floorZoomed = newClass == 'active' ? 'zoomed' : '';

	$('.auditory').removeClass('active');
	$(el).addClass(newClass);
	
	if(room && room_id)
	{
		let id = room_id == 'library' ? room_id : room;
		let pid = '#p' + id;
		let rid = "#r" + id;
		let lid = "#l" + id;
		$('.path').removeClass('visible');
		$('.active-room').removeClass('active');
		$('.label').removeClass('active');

		let floor = $('.map-wrapper').scrollLeft() > 0 ? '#floor-2' : '#floor-1';

		if(newClass == 'active')
		{
			
			$(pid).addClass('visible');
			$(rid).addClass('active');
			$(lid).addClass('active');

			let zoomLevel = 1.8;
			let svgWidth = $(floor + ' svg').innerWidth();
			let svgHeight = $(floor + ' svg').innerHeight();
			let wrapperWidth = $(floor).innerWidth();
			let wrapperHeight = $(floor).innerHeight();
			let zoomed = svgWidth > wrapperWidth;
			let scrollTop = $(floor).scrollTop();
			let scrollLeft = $(floor).scrollLeft();

			let wDifference = (svgWidth - wrapperWidth) / 2;
			let hDifference = (svgHeight - wrapperHeight) / 2;

			// Reading coordinates
			$(floor + 'svg').width(wrapperWidth * zoomLevel);
			let pathRect = $(pid)[0].getBoundingClientRect();
			let multiplier = zoomed ? zoomLevel : 1;
			let pathLeft = pathRect.left;
			let pathTop = pathRect.top;
			let pathWidth = pathRect.width;
			let pathHeight = pathRect.height;

			let targetLeft = (pathLeft - scrollLeft) + wDifference;
			let targetTop = (pathTop - scrollTop) - hDifference;

			if(!zoomed){
				$(floor + 'svg').width(wrapperWidth);
			}

			$(floor + ' svg').animate({
				width: wrapperWidth * zoomLevel
			}, 400);

			$(floor).animate({
				scrollLeft: targetLeft,
				scrollTop: targetTop
			})

		}else{
			$(floor + ' svg').animate({
				width: $(floor).innerWidth()
			}, 400, () => {
				$(floor).removeClass('zoomed');
			})
			$('.floor').animate({
				scrollLeft: 0,
				scrollTop: 0
			}, 400)
		}
	}
}

function updateIndicator()
{
	let indicator = <HTMLElement>document.querySelector('.indicator');
	indicator.style.transition = "none";
	let activeTab = <HTMLElement>document.querySelector('.tab.active');
	let left = activeTab.offsetLeft;
	let tabsWidth = (<HTMLElement>document.querySelector('.tabs')).offsetWidth;
	let right = tabsWidth - left - activeTab.offsetWidth;
	
	indicator.style.left = left + 'px';
	indicator.style.right = right + 'px';
}

function tabClick(e:MouseEvent)
{
	let indicator = <HTMLElement>document.querySelector('.indicator');
	let parent = this.parentNode;
	let active = document.querySelector('.active');
	let activeindex = [].indexOf.call(document.querySelectorAll('.tab'), active);
	let thisindex = [].indexOf.call(document.querySelectorAll('.tab'), parent);
	
	if(activeindex < thisindex)
	{
		indicator.style.transition = leftTransition;
	}else{
		indicator.style.transition = rightTransition;
	}
	
	let left = this.offsetLeft;
	let tabsWidth = (<HTMLElement>document.querySelector('.tabs')).offsetWidth;
	let right = tabsWidth - this.offsetWidth - this.offsetLeft;
	
	indicator.style.left = left + 'px';
	indicator.style.right = right + 'px';
	let href = '#'+this.href.split('#')[1];
	document.querySelectorAll('.tab-content').forEach(el => {el.classList.remove('active');});
	document.querySelectorAll('.tab').forEach(el => {el.classList.remove('active');});
	parent.classList.add('active');
	document.querySelector(href).classList.add('active');

	if(href=='#floor2'){
		$('.map-wrapper').animate({
			scrollLeft: $('.map-wrapper').outerWidth()
		}, 400);
	}else{
		$('.map-wrapper').animate({
			scrollLeft: 0
		}, 400);
	}
}

function initLanguage()
{
	$('[data-en]').each((index:number, el:HTMLElement) => {
		if(localStorage.lang){
			document.body.dataset.lang = localStorage.lang;
		}
		let lang = document.body.dataset.lang;
		el.textContent = el.dataset[lang];
	})
}

function switchLanguage(e:JQuery.ClickEvent)
{
	e.preventDefault();
	let newLang = document.body.dataset.lang == 'ru' ? 'en' : 'ru';
	localStorage.lang = newLang;
	
	document.body.dataset.lang = newLang;
	initLanguage();
}