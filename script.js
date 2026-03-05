const LoadData = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((data) => {
      DisplayBtn(data.data);
    });
};

const DisplayBtn = (lessons) => {
  const LessonContainer = document.querySelector("#level-container");
  LessonContainer.innerHTML = "";

  for (let lesson of lessons) {
    // Create Div
    const div = document.createElement("div");
    div.innerHTML = `
            <button   onClick="LoadLessonData(${lesson.level_no})" class='btn btn-outline btn-success lg:btn-md btn-sm '>Lesson ${lesson.level_no} </button>
        `;

    // Append to the create div
    LessonContainer.appendChild(div);
  }
};
LoadData();

// Load Data by lesson
const LoadLessonData = (id) => {
  const url = `https://openapi.programming-hero.com/api/level/${id}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      DisplayWordCard(data.data);
    });
};

const DisplayWordCard = (words) => {
  const CardContainer = document.querySelector("#card-container");
  CardContainer.innerHTML = "";

  words.forEach((element) => {
    const div = document.createElement("div");
    div.innerHTML = `
        <section class="bg-gray-900 p-6 rounded-lg text-center shadow-lg">
                <h1 class="text-3xl font-bold">${element.word}</h1>
                <p class="text-gray-400 my-2">Meaning / Pronunciation</p>
                <h1 class="text-2xl text-blue-400">"${element.meaning} / ${element.pronunciation}"</h1>

                <div class="flex justify-center gap-10 mt-5">
                    <button title="Play Pronunciation">
                        <i class="fa-regular fa-circle-play text-2xl hover:text-blue-500 cursor-pointer"></i>
                    </button>
                    <button title="Play Meaning">
                        <i class="fa-regular fa-circle-play text-2xl hover:text-blue-500 cursor-pointer"></i>
                    </button>
                </div>
            </section>
        `;
    CardContainer.appendChild(div);
  });
};
