const LoadData = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((data) => {
      DisplayBtn(data.data);
    });
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const DisplayBtn = (lessons) => {
  const LessonContainer = document.querySelector("#level-container");
  LessonContainer.innerHTML = "";

  for (let lesson of lessons) {
    // Create Div
    const div = document.createElement("div");
    div.innerHTML = `
            <button id="lessonId-${lesson.level_no}"   onClick="LoadLessonData(${lesson.level_no})" class='btn btn-outline btn-success lg:btn-md btn-sm buttonLs'>Lesson ${lesson.level_no} </button>
        `;

    // Append to the create div
    LessonContainer.appendChild(div);
  }
};
LoadData();

// Load Data by lesson
const LoadLessonData = (id) => {
  setLoading(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      DisplayWordCard(data.data);

      // Add Active button to lesson card
      const lessonBtn = document.getElementById(`lessonId-${id}`);
      // remove active status
      const remove = document.getElementsByClassName("buttonLs");
      for (let item of remove) {
        item.classList.add("btn-outline");
      }
      // add active specific button
      lessonBtn.classList.remove("btn-outline");
    });
};

const DisplayWordCard = (words) => {
  const CardContainer = document.querySelector("#card-container");
  CardContainer.innerHTML = "";

  if (words.length < 1) {
    const NotFoundDiv = document.createElement("div");
    NotFoundDiv.classList.add("col-span-3");
    NotFoundDiv.innerHTML = `
    <section class="bg-gray-900 p-6 rounded-lg text-center shadow-lg col-span-3 py-20">
      <img class="bg-gray-600 mx-auto " src="assets/alert-error.png" alt="">
      <p class="text-gray-400 my-2">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
      <h1 class="text-3xl font-bold">নেক্সট Lesson এ যান</h1>
    </section>
    `;
    CardContainer.appendChild(NotFoundDiv);
    setLoading(false);
    return;
  }

  words.forEach((element) => {
    
    const div = document.createElement("div");
    div.innerHTML = `
        <section  class="bg-gray-900 p-4 py-10  rounded-lg text-center shadow-lg">
                <h1 class="text-3xl font-bold">${element.word}</h1>
                <p class="text-gray-400 my-2">Meaning / Pronunciation</p>
                <h1 class="text-xl text-blue-400">"${!element.meaning && "not found"} / ${element.pronunciation}"</h1>

                <div class="flex justify-between gap-10 mt-5">
                    <button onClick="pronounceWord('${element.word}')" >
                        <i class="fa-regular fa-circle-play text-2xl hover:text-blue-500 cursor-pointer"></i>
                    </button>
                    <button onClick="InfoView(${element.id})" >
                        <i class="fa-solid fa-circle-info text-2xl hover:text-blue-500 cursor-pointer"></i>
                    </button>
                </div>  
            </section>
        `;
    CardContainer.appendChild(div);
  });
  setLoading(false);
};

const InfoView = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;

  const res = await fetch(url);
  const data = await res.json();
  DisplayCardDetails(data.data);
};

// Show array of synoname
const createElement = (ar) => {
  const create = ar.map((elm) => `<span class="btn"> ${elm} </span>`);
  return create.join("");
};

const DisplayCardDetails = (data) => {
  const show = document.getElementById("my_modal_2");
  show.showModal();

  show.innerHTML = `
  <div class="modal-box space-y-5 p-10 ">
            <h3 class="text-2xl font-bold">${data.word} ( ${data.pronunciation}!)</h3>
            <div>
                <h3 class="text-md ">Meaning</h3>
                <h3 class="text-lg font-bold">${data.meaning}</h3>
            </div>
            <div>
                <h3 class="text-lg ">Example</h3>
                <h3 class="text-md ">${data.sentence}</h3>
            </div>
            <h3 class="text-lg font-bold">সমার্থক শব্দ গুলো</h3>
            <div class='flex gap-5 '>
              ${createElement(data.synonyms)}
            </div>
            <form method="dialog" class="modal-backdrop">
                <button class='btn btn-success w-1/3 mx-auto '>close</button>
            </form>
            </div>
  `;
};

// loading
const setLoading = (status) => {
  if (status) {
    document.getElementById("card-container").classList.add("hidden");
    document.getElementById("loading").classList.remove("hidden");
  } else {
    document.getElementById("card-container").classList.remove("hidden");
    document.getElementById("loading").classList.add("hidden");
  }
};

// fetch all word
const fetchAllWord = async () => {
  let res = await fetch("https://openapi.programming-hero.com/api/words/all");
  let data = await res.json();
  console.log(data.data);
};

document.getElementById("search-btn").addEventListener("click", async (e) => {
  const inputText = document.getElementById("search-text").value;
  // console.log(inputText);
  let res = await fetch("https://openapi.programming-hero.com/api/words/all");
  let data = await res.json();
  let allData = data.data;

  const filterData = allData.filter((element) =>
    element.word.toLowerCase().includes(inputText),
  );

  DisplayWordCard(filterData);
});
