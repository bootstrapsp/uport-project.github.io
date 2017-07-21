///////////////////////
// Window URL Bar Clear
///////////////////////
window.history.pushState('', '', window.location.pathname)

///////////////////////
// Utilities
///////////////////////
const pvd = (e) => e.preventDefault();
const hide = (item) => { item.style.display = 'none' }
const show = (item) => { item.style.display = 'block' }
const $$ = (item) => document.querySelectorAll(item)
const wrap = (toWrap, wrapper) => {
  wrapper = wrapper || document.createElement('div');
  toWrap.nextSibling
    ? toWrap.parentNode.insertBefore(wrapper, toWrap.nextSibling)
    : toWrap.parentNode.appendChild(wrapper)
  return wrapper.appendChild(toWrap)
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

const mainDOM =
  $$('main')[0]

const navDOM =
  $$('header')[0]

const userAreaDOM =
  $$('.user-area')[0]

const sideBarDOM =
  $$('.sidebar')[0]

const libDocDOM =
  $$('.lib-doc')[0]

const guideSectionsDOM =
  $$('.guides .guide section')

///////////////////////
// Nav Router
///////////////////////

navDOM.onclick = (evt) => {
  const desiredHash = evt.target.parentElement.hash;

  if(desiredHash !== undefined){
    const desiredHashText = evt.target.parentElement.hash.replace('#','');

    mainDOM.classList.forEach((mainClass) => {
      mainClass !== 'main'
        ? mainDOM.classList.remove(mainClass)
        : null
    })
    mainDOM.classList.add(desiredHashText)
  }
  pvd(evt);
}

///////////////////////
// Sidebar Populator
///////////////////////

for (var i = 0; i < guideSectionsDOM.length; i++) {

  var section = guideSectionsDOM[i];

  var listA = document.createElement('ul')

  var guideSectionAHeader= section.querySelectorAll('h1')[0]
  var guideSectionAHeaders2 = section.querySelectorAll('h2')

  guideSectionAHeaders2.forEach((el) => {

    var url = el.innerHTML.toLowerCase().split(' ').join('-')
    el.id = url

    var link = document.createElement('a')
    link.innerHTML = el.innerHTML
    link.href = '#' + url

    var listItem = document.createElement('li')
    listItem.appendChild(link)

    listA.appendChild(listItem)
  })

  var sidebarSection = sideBarDOM.querySelectorAll('section')[i]
  sidebarSection.appendChild(guideSectionAHeader)
  sidebarSection.appendChild(listA)
}



const docTOCpath = '.lib-doc > ul:nth-of-type(1) li ul li a'
const sidebarTOCpath = 'main .apidocs .sidebar section:nth-child('
const sidebarTOCpathEND= ') ul'

const ucContentLinks = $$('#uport-connect ' + docTOCpath)
const sideBarLibADOM = $$(sidebarTOCpath + '1' + sidebarTOCpathEND)[0]

const ujContentLinks = $$('#uport-js ' + docTOCpath)
const sideBarLibBDOM = $$(sidebarTOCpath + '2' + sidebarTOCpathEND)[0]

const urContentLinks = $$('#uport-registry ' + docTOCpath)
const sideBarLibCDOM = $$(sidebarTOCpath + '3' + sidebarTOCpathEND)[0]

ucContentLinks.forEach((el) => {
  var clone = el.cloneNode(true);
  var li = document.createElement('li')
      li.appendChild(clone)
  sideBarLibADOM.appendChild(li)
})

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
const uch2cc = '.lib-section#uport-connect .lib-doc > h2:nth-of-type(3)'
const uch2ccDOM = $$(uch2cc)[0]
const uch2ccDOMPlusAll = $$(uch2cc + ' ~ *')
hide(uch2ccDOM);
uch2ccDOMPlusAll.forEach((el) => {hide(el)})
