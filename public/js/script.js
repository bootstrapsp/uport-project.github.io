'use strict';

///////////////////////
// Window URL Bar Clear
///////////////////////
window.history.pushState('', '', window.location.pathname);

///////////////////////
// Utilities
///////////////////////
var pvd = function pvd(e) {
  return e.preventDefault();
};
var hide = function hide(item) {
  item.style.display = 'none';
};
var show = function show(item) {
  item.style.display = 'block';
};
var $$ = function $$(item) {
  return document.querySelectorAll(item);
};
var wrap = function wrap(toWrap, wrapper) {
  wrapper = wrapper || document.createElement('div');
  toWrap.nextSibling ? toWrap.parentNode.insertBefore(wrapper, toWrap.nextSibling) : toWrap.parentNode.appendChild(wrapper);
  return wrapper.appendChild(toWrap);
};

// TODO: Logo / Sign In
// const developersNav =
//   $$('a.logo-link')[0]
//
// const signInNav =
//   $$('.sign-in-link')[0]
//
// const logOutNav =
//   $$('.log-out a')[0]

///////////////////////
// DOM HOOKS
///////////////////////

var mainDOM = $$('main')[0];

var navDOM = $$('header')[0];

var userAreaDOM = $$('.user-area')[0];

var sideBarDOM = $$('.sidebar')[0];

var libDocDOM = $$('.lib-doc')[0];

var guideSectionsDOM = $$('.guides .guide section');

///////////////////////
// Nav Router
///////////////////////

navDOM.onclick = function (evt) {
  var desiredHash = evt.target.parentElement.hash;

  if (desiredHash !== undefined) {
    var desiredHashText = evt.target.parentElement.hash.replace('#', '');

    mainDOM.classList.forEach(function (mainClass) {
      mainClass !== 'main' ? mainDOM.classList.remove(mainClass) : null;
    });
    mainDOM.classList.add(desiredHashText);
  }
  pvd(evt);
};

///////////////////////
// Sidebar Populator
///////////////////////

for (var i = 0; i < guideSectionsDOM.length; i++) {

  var section = guideSectionsDOM[i];

  var listA = document.createElement('ul');

  var guideSectionAHeader = section.querySelectorAll('h1')[0];
  var guideSectionAHeaders2 = section.querySelectorAll('h2');

  guideSectionAHeaders2.forEach(function (el) {

    var url = el.innerHTML.toLowerCase().split(' ').join('-');
    el.id = url;

    var link = document.createElement('a');
    link.innerHTML = el.innerHTML;
    link.href = '#' + url;

    var listItem = document.createElement('li');
    listItem.appendChild(link);

    listA.appendChild(listItem);
  });

  var sidebarSection = sideBarDOM.querySelectorAll('section')[i];
  sidebarSection.appendChild(guideSectionAHeader);
  sidebarSection.appendChild(listA);
}

var docTOCpath = '.lib-doc > ul:nth-of-type(1) li ul li a';
var sidebarTOCpath = 'main .apidocs .sidebar section:nth-child(';
var sidebarTOCpathEND = ') ul';

var ucContentLinks = $$('#uport-connect ' + docTOCpath);
var sideBarLibADOM = $$(sidebarTOCpath + '1' + sidebarTOCpathEND)[0];

var ujContentLinks = $$('#uport-js ' + docTOCpath);
var sideBarLibBDOM = $$(sidebarTOCpath + '2' + sidebarTOCpathEND)[0];

var urContentLinks = $$('#uport-registry ' + docTOCpath);
var sideBarLibCDOM = $$(sidebarTOCpath + '3' + sidebarTOCpathEND)[0];

ucContentLinks.forEach(function (el) {
  var clone = el.cloneNode(true);
  var li = document.createElement('li');
  li.appendChild(clone);
  sideBarLibADOM.appendChild(li);
});

// TODO: Get JSDOC based stuff in there
// ujContentLinks.forEach((el) => {
//   var li = document.createElement('li')
//       li.appendChild(el)
//   sideBarLibBDOM.appendChild(li)
// })
//
// urContentLinks.forEach((el) => {
//   var li = document.createElement('li')
//       li.appendChild(el)
//   sideBarLibCDOM.appendChild(li)
// })

// signInNav.onclick = (e) => {userAreaDOM.classList.add('menu-open')}
// logOutNav.onclick = (e) => {userAreaDOM.classList.remove('menu-open')}

///////////////////////
// HAX
///////////////////////

// Hide dupe of ConnectCore
var uch2cc = '.lib-section#uport-connect .lib-doc > h2:nth-of-type(3)';
var uch2ccDOM = $$(uch2cc)[0];
var uch2ccDOMPlusAll = $$(uch2cc + ' ~ *');
hide(uch2ccDOM);
uch2ccDOMPlusAll.forEach(function (el) {
  hide(el);
});