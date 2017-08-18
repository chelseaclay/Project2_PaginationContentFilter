const $allStudents = $("li.student-item");
const $matchedStudents = $("li.searchMatch");
const $page = $(".page");
const $studentSearchDiv = $("<div class='student-search'></div>");
const $searchInput = $("<input placeholder='Search for students...''>");
const $searchBtn = $("<button>Search</button>");

//Set a variable for "Search not found" message and append it to the page
let $noStudentsFound = $('<p></p>');
$page.append($noStudentsFound);

// Put search bar together and add to page
$($studentSearchDiv).append($searchInput);
$($studentSearchDiv).append($searchBtn);

function showPage(pageClicked, studentList) {
  // first hide all students on the page
  $("li.student-item").hide();
  // Use the slice method to display the correct users
     $(studentList).slice((pageClicked * 10) - 10, pageClicked * 10).show();
     $("li.searchMatch").slice((pageClicked * 10) - 10, pageClicked * 10).show();
 }

 function appendPageLinks(totalStudents, studentList) {
  // determine how many pages for this student list
  const totalPages = Math.ceil(totalStudents / 10);
  // create a page link section
  let $pageLinksSection = $("<div class='pagination'></div>");
  let $pageLinksUl = $("<ul></ul>");
  $pageLinksSection.append($pageLinksUl);
  // “for” every page
  for (let i = 0; i < totalPages; i++) {
      // add a page link to the page link section
      let $pageLinksLi = $("<li></li>");
      let $pageLinksA = $("<a href='#'></a>");
          $pageLinksA.html(i + 1);
      $pageLinksLi.append($pageLinksA);
      $pageLinksUl.append($pageLinksLi);
    }
  // remove the old page link section from the site
  $(".pagination").remove();
  // append our new page link section to the site
  $page.append($pageLinksSection);
  // define what happens when you click a link
  $(".pagination a").on("click", function () {
    let btnClicked = $(this).text();
    // Use the showPage function to display the page for the link clicked
    showPage(btnClicked, studentList);
    // mark that link as “active”
    $(".active").removeClass("active");
    $(this).addClass("active");
  });
}

function searchList() {
  let matched = [];
  // Obtain the value of the search input
  let $search = $($searchInput).val().toLowerCase();
  // remove the previous page link section
  $(".pagination").remove();
  //remove previous search matches
  $(".searchMatch").removeClass("searchMatch");
  //Set the $noStudentsFound message to include the user's search
  $($noStudentsFound).html($('<p>Sorry, there are no students enrolled by the name of ' + $search + '.</p>'));

  // Loop over the student list, and for each student…
  for (let i = 0; i < $allStudents.length; i++) {
    let $studentDetails = $(".student-details");
    // ...obtain the student’s name…
    let $studentName = $($studentDetails[i]).find("h3");
    // ...and the student’s email…
    let $studentEmail = $($studentDetails[i]).find(".email");
    // ...if the search value is found inside either email or name…
    if ($studentName.text().indexOf($search) !== -1 || $studentEmail.text().indexOf($search) !== -1) {
      $($studentName).parent().parent().addClass("searchMatch");
      // ...add this student to list of “matched” student
      matched.push($studentName.text());
    }
  }

  // If there’s no “matched” students…
  if (matched.length === 0) {
    // ...display a “no student’s found” message
    $noStudentsFound.show();
    // ...or hide the $noStudentsFound paragraph
  } else {
    $noStudentsFound.hide();
  }

  // If over ten students were found…
  if (matched.length > 10) {
    // ...call appendPageLinks with the matched students
    appendPageLinks(matched.length, $matchedStudents);
    $(".pagination a").first().addClass("active");
  }

  // Call showPage to show first ten students of matched list
  showPage(1, $matchedStudents);
}

// Trigger the first page to load when document is ready
$(document).ready(function () {
  appendPageLinks($allStudents.length, $allStudents);
  $(".pagination a").first().trigger("click");

  // Add search bar to page
  $(".page-header").append($studentSearchDiv);

  $($searchBtn).on("click", function(){
    searchList();
  });
});
