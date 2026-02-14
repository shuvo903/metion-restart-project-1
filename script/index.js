const createElement = (arr) => {
  const htmlElements = arr.map((el) => `<span class = "btn">${el}</span>`);
  return htmlElements.join(" ");
};

const menageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayLesson(json.data));
};

const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lesson-btn");
  // console.log(lessonButtons);

  lessonButtons.forEach((btn) => btn.classList.remove("active"));
};

const loadLevelWord = (id) => {
  menageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive();
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      clickBtn.classList.add("active");
      // console.log(clickBtn);
      displayLevelWords(data.data);
    });
};

const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;

  // console.log(url);

  const res = await fetch(url);
  const details = await res.json();
  displayWordDetail(details.data);
};

const displayWordDetail = (word) => {
  console.log(word);
  const detailsBox = document.getElementById("details-container");
  detailsBox.innerHTML = `
      <div class="">
        <h2 class="text-2xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i> :${word.pronunciation})</h2>
    </div>
    <div class="">
        <h2 class=" font-bold">Meaning</h2>
        <p>${word.meaning}</p>
    </div>
    <div class="">
        <h2 class=" font-bold">Example</h2>
        <p>${word.sentence}</p>
    </div>
    <div class="">
        <h2 class=" font-bold">সমার্থক শব্দ গুলো</h2>
   <div class = "">${createElement(word.synonyms)}</div>
    </div>
  `;
  document.getElementById("word_modal").showModal();
};

const displayLevelWords = (words) => {
  wordeContainer = document.getElementById("word-container");
  wordeContainer.innerHTML = "";

  if (words.length == 0) {
    wordeContainer.innerHTML = `
<div class="text-center col-span-full space-y-6 font-bangla">
 <img class="mx-auto" src="./assets/alert-error.png" alt="">
    <p class="text-xl  font-medium text-gray-400">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
    <h2 class="font-bold text-4xl">নেক্সট Lesson এ যান</h2>
</div>
`;
    menageSpinner(false);
    return;
  }

  words.forEach((word) => {
    // id
    // :
    // 83
    // level
    // :
    // 1
    // meaning
    // :
    // "দরজা"
    // pronunciation
    // :
    // "ডোর"
    // word
    // :
    // "Door"

    const card = document.createElement("div");
    card.innerHTML = `
        <div class="bg-white text-center rounded-xl shadow-sm py-10 px-5 space-y-4">
            <h2 class="font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায়নি "}</h2>
            <p class="font-semibold">Meaning /Pronounciation</p>
            <div class=" text-2xl font-medium font-bangla">
                "${word.meaning ? word.meaning : "অর্থ  পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "{Pronunciation পাওয়া যায়নি"}"
            </>
            <div class=" flex justify-between items-center">
                <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF30]"><i class="fa-solid fa-circle-info"></i></button>
                <button class="btn bg-[#1A91FF15] hover:bg-[#1A91FF30]"><i class="fa-solid fa-volume-high"></i></button>
            </div>
            </div>
        </div>
  `;

    wordeContainer.append(card);
  });
  menageSpinner(false);
};
const displayLesson = (lessons) => {
  const levelContainer = document.getElementById("level-container");

  levelContainer.innerHTML = "";

  for (let lesson of lessons) {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
        <button id="lesson-btn-${lesson.level_no}" onclick = "loadLevelWord(${lesson.level_no})"  class ="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}
        </button>
        `;

    levelContainer.append(btnDiv);
  }
};
loadLessons();

document.getElementById("btn-Search").addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();
  // console.log(searchValue);

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      // console.log(allWords);
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue),
      );
      displayLevelWords(filterWords);
    });
});
