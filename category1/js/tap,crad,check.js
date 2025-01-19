

document.addEventListener("DOMContentLoaded", function() {
  // 전체 메뉴를 클릭하면 모든 카드를 보이게 설정
  const allMenu = document.querySelector('[data-category="all"]');
  const cards = document.querySelectorAll('.card');
  
  allMenu.addEventListener("click", function() {
    // 모든 카드 보여주기
    cards.forEach(card => {
      card.style.display = "block";
    });
    currentCategory = "all"; 

    displayCards(); // 카드 표시
  });



  // 각 카테고리 메뉴 클릭 시 해당 카테고리에 맞는 카드만 보이게

  const quickItems = document.querySelectorAll('.quick-item');
  quickItems.forEach(item => {
    item.addEventListener("click", function(event) {
      const category = item.getAttribute('data-category');
      currentCategory = category; // 카테고리 변경
      filterCards(category);
      displayCards(); // 카드 표시
      event.preventDefault();
    });
  });

  let currentCategory = "all"; // 기본값은 모든 카테고리

  // 카테고리 필터링 함수
  function filterCards(category) {
    // 카드를 모두 숨김
    cards.forEach(card => {
      card.style.display = "none"; // 기본적으로 숨김
    });

    if (category === "all") {
      // 모든 카드를 보여줌
      cards.forEach(card => card.style.display = "block");
    } else {
      // 선택된 카테고리에 맞는 카드만 보이게
      cards.forEach(card => {
        if (card.getAttribute('data-category') === category) {
          card.style.display = "block";
        }
      });
    }
  }

  // 카드를 정렬하는 함수
  function sortCards(sortType) {
    const filteredCards = Array.from(cards).filter(card => {
      return currentCategory === "all" || card.getAttribute('data-category') === currentCategory;
    });

    const sortedCards = filteredCards.sort((a, b) => {
      const latestA = Number(a.dataset.latest); 
      const latestB = Number(b.dataset.latest); 
      const viewsA = Number(a.dataset.views); 
      const viewsB = Number(b.dataset.views); 

      if (sortType === "latest") {
        return latestB - latestA; // 최신순 
      } else if (sortType === "views") {
        return viewsB - viewsA; // 조회순 
      }
    });

    const container = document.querySelector(".food-container");
    container.innerHTML = ""; // 기존 카드를 초기화
    sortedCards.forEach(card => container.appendChild(card)); // 정렬된 카드 추가
  }

  // 최신순, 조회순 왼쪽에 체크 아이콘
  document.querySelectorAll(".food-txt-right a").forEach(link => {
    link.addEventListener("click", (event) => {
      event.preventDefault(); // 기본 동작 방지
      const sortType = event.target.dataset.sort; // 클릭한 링크의 data-sort 값을 가져옴

      // 클릭된 링크에 active 클래스 추가 및 다른 링크에서 active 클래스 제거
      document.querySelectorAll(".food-txt-right a").forEach(a => a.classList.remove("active"));
      event.target.classList.add("active");

      sortCards(sortType); // 카드 정렬 함수 호출
    });
  });

  // 페이지네이션 기능
  const cardsPerPage = 12; // 한 페이지에 보여줄 카드 수
  let currentPage = 1; // 현재 페이지 번호

  // 페이지 정보 요소
  const pageInfo = document.getElementById("pageInfo");
  const prevButton = document.getElementById("prevPage");
  const nextButton = document.getElementById("nextPage");

  // 페이지 정보 업데이트
  function updatePageInfo() {
    pageInfo.textContent = `${currentPage} / ${totalPages}`;
  }

  // 페이지에 맞는 카드 표시 함수
  function displayCards() {
    // 필터링된 카드들만 가져오기
    const filteredCards = Array.from(cards).filter(card => {
      return currentCategory === "all" || card.getAttribute('data-category') === currentCategory;
    });

    const totalPages = Math.ceil(filteredCards.length / cardsPerPage); // 총 페이지 수

    // 이전, 다음 버튼 상태 업데이트
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;

    // 카드 숨기기
    filteredCards.forEach(card => card.style.display = "none");

    // 현재 페이지에 해당하는 카드만 표시
    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    const visibleCards = filteredCards.slice(start, end);

    visibleCards.forEach(card => {
      card.style.display = "block"; // 선택된 카드들만 보이기
    });

    updatePageInfo(); // 페이지 정보 업데이트
  }

  // 이전 페이지 버튼 클릭
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayCards();
    }
  });

  // 다음 페이지 버튼 클릭
  nextButton.addEventListener("click", () => {
    const filteredCards = Array.from(cards).filter(card => {
      return currentCategory === "all" || card.getAttribute('data-category') === currentCategory;
    });
    const totalPages = Math.ceil(filteredCards.length / cardsPerPage); // 총 페이지 수

    if (currentPage < totalPages) {
      currentPage++;
      displayCards();
    }
  });

  // 초기화
  displayCards(); // 페이지 로딩 시 카드 표시
});
