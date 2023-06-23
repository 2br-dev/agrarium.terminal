import * as M from 'materialize-css';
import * as $ from 'jquery';

M.Sidenav.init(document.querySelectorAll('.sidenav'));
(window as any).JQ = $;

const leftTransition = "left .4s cubic-bezier(.76,-0.48,.32,1.44) .07s, right .4s cubic-bezier(.76,-0.48,.32,1.44) .01s";
const rightTransition = "left .4s cubic-bezier(.76,-0.48,.32,1.44) .01s, right .4s cubic-bezier(.76,-0.48,.32,1.44) .07s";

let initialSecondsLeft = 30;
let secondsLeft:number = initialSecondsLeft;
let secondsModalTrigger = 15;
let inactiveTimeout:NodeJS.Timeout;

$('body').on('click', '.auditory', showRoute);
$('body').on('click', '#caffee, #cachier', showInfra);
$('body').on('click', '#lang-switcher', switchLanguage);
$('body').on('click', '#restRoom', showRestRoom);
$('body').on('click', resetTimer);

(() => {
	document.querySelectorAll('.tab').forEach(el => {el.querySelector('a').addEventListener('click', tabClick);})
	createInactiveTimer();
	initLanguage();
})();

function resetTimer()
{
	clearInterval(inactiveTimeout);
	secondsLeft=initialSecondsLeft;
	createInactiveTimer();
}

function showRoute(e:JQuery.ClickEvent)
{
	e.preventDefault();
	$('.infrastructure').removeClass('active');
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
			let wrapperWidth = $(floor).innerWidth();
			let wrapperHeight = $(floor).innerHeight();
			let wrapperTop = $(floor).offset()?.top;
			let zoomIndex = $(floor).data('zoom') || 1;

			if(zoomIndex == 1){
	
				let pathRect = (<SVGElement>document.querySelector(pid)).getBoundingClientRect();
				let pathTop = pathRect.top;
				let pathLeft = pathRect.left;
				let pathWidth = pathRect.width;
				let pathHeight = pathRect.height;
				let top = (((pathTop+pathHeight) * zoomLevel) - (wrapperHeight+(pathHeight*zoomLevel) / 2) - wrapperTop);
				let left = (((pathLeft+pathWidth) * zoomLevel) - ((wrapperWidth + (pathWidth * zoomLevel)) / 2));
	
				$(floor).data('zoom', zoomLevel)
	
				$(floor + ' svg').animate({
					width: wrapperWidth * zoomLevel
				}, 400);
	
				$(floor).animate({
					scrollLeft: left,
					scrollTop: top
				})
			}else{

				let scrollLeft = $(floor).scrollLeft();
				let scrollTop = $(floor).scrollTop();
				$(floor + ' svg').width($(floor).width());

				let pathRect = (<SVGElement>document.querySelector(pid)).getBoundingClientRect();
				let pathTop = pathRect.top;
				let pathLeft = pathRect.left;
				let pathWidth = pathRect.width;
				let pathHeight = pathRect.height;
				let top = (((pathTop+pathHeight) * zoomLevel) - (wrapperHeight+(pathHeight*zoomLevel) / 2) - wrapperTop);
				let left = (((pathLeft+pathWidth) * zoomLevel) - ((wrapperWidth + (pathWidth * zoomLevel)) / 2));

				$(floor + ' svg').width($(floor).width() * zoomLevel);
				$(floor).scrollTop(scrollTop);
				$(floor).scrollLeft(scrollLeft);
	
				$(floor).attr('data-zoom', zoomLevel)
	
				$(floor).animate({
					scrollLeft: left,
					scrollTop: top
				}, 400)
			}

		}else{
			$(floor).data('zoom', 1)
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

function showInfra(e:JQuery.ClickEvent)
{
	let el = <HTMLElement>e.currentTarget;
	$('.active-room').removeClass('active');
	let room  = el.dataset['room'] || '';
	let room_id = el.dataset['id'] || '';

	// let floorZoomed = newClass == 'active' ? 'zoomed' : '';

	let action = () => {
		$('.tab a').removeClass('active');
		$('[href="#floor1"]').addClass('active');
		$('.tab-content').removeClass('active');
		$('#floor1').addClass('active');
	
		$(el).removeClass('active');
		
		if(room && room_id)
		{
			let id = room_id == 'library' ? room_id : room;
			let pid = '#p' + id;
			let rid = "#r" + id;
			let lid = "#l" + id;

			let already = $(pid).hasClass('visible');
			let floor = $('.map-wrapper').scrollLeft() > 0 ? '#floor-2' : '#floor-1';
			$('.infrastructure').removeClass('active');


			if(already){
				$(floor + ' svg').animate({
					width : $(floor).width()
				});
				$('.path').removeClass('visible');
				return;
			}

			$('.path').removeClass('visible');
			$('.active-room').removeClass('active');
			$('.label').removeClass('active');
	
	
			$(pid).addClass('visible');
			$(rid).addClass('active');
			$(lid).addClass('active');
			
			let zoomLevel = 1.8;
			let wrapperWidth = $(floor).innerWidth();
			let wrapperHeight = $(floor).innerHeight();
			let wrapperTop = $(floor).offset()?.top;
			let zoomIndex = $(floor).data('zoom') || 1;

			let scrollLeft = $(floor).scrollLeft();
			let scrollTop = $(floor).scrollTop();
			$(floor + ' svg').width($(floor).width());

			let pathRect = (<SVGElement>document.querySelector(pid)).getBoundingClientRect();
			let pathTop = pathRect.top;
			let pathLeft = pathRect.left;
			let pathWidth = pathRect.width;
			let pathHeight = pathRect.height;
			let top = (((pathTop+pathHeight) * zoomLevel) - (wrapperHeight+(pathHeight*zoomLevel) / 2) - wrapperTop);
			let left = (((pathLeft+pathWidth) * zoomLevel) - ((wrapperWidth + (pathWidth * zoomLevel)) / 2));

			$(floor + ' svg').width($(floor).width() * zoomLevel);
			$(floor).scrollTop(scrollTop);
			$(floor).scrollLeft(scrollLeft);

			$(floor).attr('data-zoom', zoomLevel)

			$(floor).animate({
				scrollLeft: left,
				scrollTop: top
			}, 400)

		}
	}

	if($('.map-wrapper').scrollLeft() != 0){
		$('.map-wrapper').animate({
			scrollLeft: 0
		}, 400, () => {
			action();
		})
	}else{
		action();
	}
}

function showRestRoom(e:JQuery.ClickEvent)
{

	$('.active-room').removeClass('active');
	let tab = $('.map-wrapper').scrollLeft() == 0 ? 1 : 2;
	let route1 = '#prestroom'+tab.toString() + 'f';
	let route2 = '#prestroom'+tab.toString() + 'm'

	let dest1 =  '#restroom'+tab.toString() + 'f';
	let dest2 =  '#restroom'+tab.toString() + 'm';


	let newClass = $(route1).hasClass('visible') ? '' : 'visible';
	let activeClass = $(dest1).hasClass('active') ? '' : 'active';

	$('.path').removeClass('visible');
	$('.infrastructure').removeClass('active');
	let selector = `#floor-${tab} svg`;
	let zoomed = $(selector).innerWidth() > $('.floor').innerWidth();

	if(zoomed){
		$(selector).animate({
			width: $('.floor').innerWidth()
		}, 400, () => {
			$(route1).addClass(newClass);
			$(route2).addClass(newClass);
			$(dest1).addClass(activeClass);
			$(dest2).addClass(activeClass);
		})
	}else{
		$(route1).addClass(newClass);
		$(route2).addClass(newClass);
		$(dest1).addClass(activeClass);
		$(dest2).addClass(activeClass);
	}

}

function tabClick(e:MouseEvent)
{
	let el = <HTMLLinkElement>e.target;
	let href = el.href.split('#')[1];
	$(`.tab a`).removeClass('active');
	let selector = `[href="#${href}"]`;
	$(selector).addClass('active');

	$('.tab-content').removeClass('active');
	$('#'+href).addClass('active');

	let svg = href == 'floor1' ? '#floor-1 svg' : '#floor-2 svg';
	$('.path').removeClass('visible');
	$('.active-room').removeClass('active');
	$('.infrastructure').removeClass('active');
	$('.auditory').removeClass('active');
	$(svg).width($('.floor').width());

	let scrollLeft = href == 'floor2' ? $('.map-wrapper').innerWidth() : 0;

	$('.map-wrapper').animate({
		scrollLeft: scrollLeft
	}, 600);
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

function createInactiveTimer()
{

	if(window.location.pathname == "/") return;

	inactiveTimeout = setInterval(() => {

		if(secondsLeft > 0)
		{
			secondsLeft-=1;
		}

		console.log(secondsLeft);

		if(secondsLeft == secondsModalTrigger)
		{

			let modal = document.createElement('div');
			modal.id = "inactive-modal";
			modal.classList.add('inactive-modal');
	
			let buttonsContainer = document.createElement("div");
			buttonsContainer.classList.add("buttons-wrapper");
			
			let modalText = document.createElement('p');
			modalText.innerHTML = `
			<div>Завершение<br /> текущего сеанса</div>
			<div>через <strong id='seconds-left'>15</strong> секунд</div>
			<div>Коснитесь для отмены</div>
			<div class="img-wrapper">
				<img src="/img/tap.gif">
			</div>
			`;
	
			let shadow = document.createElement('div');
			shadow.id="shadow";
		
			modal.addEventListener('click', () => {
				clearInterval(inactiveTimeout);
	
				document.body.removeChild(modal);
				document.body.removeChild(shadow);
	
				secondsLeft=initialSecondsLeft;
	
				createInactiveTimer();
			});
	
			modal.appendChild(modalText);
			modal.appendChild(buttonsContainer);


			if(!document.querySelectorAll('#inactive-modal').length){
				document.body.appendChild(modal);
				document.body.appendChild(shadow);
			}
		}

		if(secondsLeft == 0)
		{
			window.location.href = "/";
		}

		if(document.querySelectorAll('#seconds-left').length)
		{
			document.querySelector('#seconds-left').textContent = secondsLeft.toString();
		}

		// console.log({
		// 	secondsLeft, secondsModalTrigger
		// })
	}, 1000);
}

function destroyInactiveTimer()
{
	clearInterval(inactiveTimeout);
	secondsLeft = initialSecondsLeft;

	$('.inactive-modal').remove();
}