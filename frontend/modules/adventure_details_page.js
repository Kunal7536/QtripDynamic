import config from "../conf/index.js";

//Implementation to extract adventure ID from query params
function getAdventureIdFromURL(search) {
  // TODO: MODULE_ADVENTURE_DETAILS
  // 1. Get the Adventure Id from the URL
  const urlParams = new URLSearchParams(search);
  const AdventureId = urlParams.get('adventure');
  return AdventureId;
}
//Implementation of fetch call with a paramterized input based on adventure ID
async function fetchAdventureDetails(adventureId) {
  try{
    const result = await fetch(
      config.backendEndpoint + `/adventures/detail?adventure=${adventureId}`
    );
    const data = await result.json();
    return data;
  }
  catch(e){
    return null;
  }
}

//Implementation of DOM manipulation to add adventure details to DOM
function addAdventureDetailsToDOM(adventure) {
  document.getElementById("adventure-name").innerHTML = adventure.name;
  document.getElementById("adventure-subtitle").innerHTML = adventure.subtitle;
  adventure.images.map((image) =>{
    let ele = document.createElement("div");
    ele.className = "col-lg-12";
    ele.innerHTML = `
    <img
        src=${image}
        alt=""
        class="activity-card-image pb-3 pb-md-0"
    />
        `;
    document.getElementById("photo-gallery").appendChild(ele);
  });
  document.getElementById("adventure-content").innerHTML = adventure.content;
}

//Implementation of bootstrap gallery component
function addBootstrapPhotoGallery(images) {
  document.getElementById("photo-gallery").innerHTML = `
  <div id="carouselExampleIndicators" class="carousel slide">
  <div class="carousel-indicators">
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
  </div>
  <div class="carousel-inner">
  </div>
  <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Previous</span>
  </button>
  <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Next</span>
  </button>
</div>`;
  images.map((image, idx) => {
    let ele = document.createElement("div");
    ele.className = `carousel-item ${idx === 0 ? "active" : "" }`;
    ele.innerHTML=`
    <img 
        src=${image}
        alt=""
        srcset=""
        class="activity-card-image pb-3 pb-md-0"
      />
          `;
    document.querySelector(".carousel-inner").appendChild(ele);
  });

  console.log(document.getElementById("photo-gallery"));
}

//Implementation of conditional rendering of DOM based on availability
function conditionalRenderingOfReservationPanel(adventure) {
  if(adventure["available"])
  {
    document.getElementById("reservation-panel-sold-out").style.display="none";
    document.getElementById("reservation-panel-available").style.display="block";
    document.getElementById("reservation-person-cost").innerHTML=adventure["costPerHead"];
  }
  else
  {
    document.getElementById("reservation-panel-sold-out").style.display="block";
    document.getElementById("reservation-panel-available").style.display="none";
  }
}

//Implementation of reservation cost calculation based on persons
function calculateReservationCostAndUpdateDOM(adventure, persons) {
  document.getElementById("reservation-cost").innerHTML=persons*adventure["costPerHead"];
}

//Implementation of reservation form submission
function captureFormSubmit(adventure) {
  const myForm=document.getElementById("myForm");
  myForm.addEventListener("submit",async(e)=>{
    e.preventDefault();
    let data={
      name:myForm.elements["name"].value,
      date:new Date(myForm.elements["date"].value),
      person:myForm.elements["person"].value,
      adventure:adventure["id"]
    }
    try{
      const url=`${config.backendEndpoint}/reservations/new`;
      const res=await fetch(url,{
        method:"POST",
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(data)
      });
      alert("success");
      window.location.reload();
    }
    catch(error){
      console.log(error);
      alert("failed");
    }
  });
}

//Implementation of success banner after reservation
function showBannerIfAlreadyReserved(adventure) {
 if(adventure["reserved"]==true){
  document.getElementById("reserved-banner").style.display="block";
 }
 else{
  document.getElementById("reserved-banner").style.display="none";
 }
}

export {
  getAdventureIdFromURL,
  fetchAdventureDetails,
  addAdventureDetailsToDOM,
  addBootstrapPhotoGallery,
  conditionalRenderingOfReservationPanel,
  captureFormSubmit,
  calculateReservationCostAndUpdateDOM,
  showBannerIfAlreadyReserved,
};
