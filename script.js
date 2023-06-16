$(document).ready(function () {
  $("#search-button").click(function () {
    var searchTerm = $("#search-input").val();
    $.ajax({
      url: "/search",
      type: "POST",
      data: { searchTerm: searchTerm },
      success: function (data) {
        displaySearchResults(data);
      },
    });
  });

  function displaySearchResults(results) {
    var searchResults = $("#search-results");
    searchResults.empty();
    if (results.length === 0) {
      searchResults.append("<p>No results found.</p>");
    } else {
      var table = $('<table class="ui celled table table-auto">');
      var tableHeader = $(
        "<thead><tr><th>Name</th><th>Email</th><th>Code</th><th>Actions</th></tr></thead>"
      );
      table.append(tableHeader);
      var tableBody = $("<tbody>");
      for (var i = 0; i < results.length; i++) {
        var person = results[i];
        var row = $("<tr>");
        row.append("<td class='md:px-6'>" + person.profile.name + "</td>");
        row.append("<td class='md:px-6'>" + person.email + "</td>");
        row.append("<td class='md:px-6'>" + person.code + "</td>");
        if (!person.status.checkedIn) {
          row.append(
            '<td><button class="p-6 checkin-button px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none" data-id="' +
              person._id +
              '">Check-in</button></td>'
          );
        } else {
          row.append(
            '<td><button class="p-6 uncheckin-button px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none" data-id="' +
              person._id +
              '">Undo Check-in</button></td>'
          );
        }

        if (!person.meal1) {
          row.append(
            '<td><button class="p-6 meal1-button px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none" data-id="' +
              person._id +
              '">Meal 1</button></td>'
          );
        } else {
          row.append(
            '<td><button class="p-6 unmeal1-button px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none" data-id="' +
              person._id +
              '">Undo</button></td>'
          );
        }

        if (!person.meal2) {
          row.append(
            '<td><button class="p-6 meal2-button px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none" data-id="' +
              person._id +
              '">Meal 2</button></td>'
          );
        } else {
          row.append(
            '<td><button class="p-6 unmeal2-button px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none" data-id="' +
              person._id +
              '">Undo</button></td>'
          );
        }

        if (!person.meal3) {
          row.append(
            '<td><button class="p-6 meal3-button px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none" data-id="' +
              person._id +
              '">Meal 3</button></td>'
          );
        } else {
          row.append(
            '<td><button class="p-6 unmeal3-button px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none" data-id="' +
              person._id +
              '">Undo</button></td>'
          );
        }

        tableBody.append(row);
      }
      table.append(tableBody);
      searchResults.append(table);
    }
  }

  $(document).on("click", ".checkin-button", function () {
    var personId = $(this).data("id");
    var el = $(this);
    $.ajax({
      url: "/checkin",
      type: "POST",
      data: { personId: personId },
      success: function (data) {
        // Handle success, such as displaying a success message
        // alert(`Checked in successfully!`);
        el.replaceWith(
          '<td><button class="p-6 uncheckin-button px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none" data-id="' +
            personId +
            '">Undo Check-in</button></td>'
        );
      },
    });
  });

  $(document).on("click", ".meal1-button", function () {
    var personId = $(this).data("id");
    var el = $(this);
    $.ajax({
      url: "/meal1",
      type: "POST",
      data: { personId: personId },
      success: function (data) {
        // Handle success, such as displaying a success message
        // alert(`Checked in successfully!`);
        el.replaceWith(
          '<td><button class="p-6 unmeal1-button px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none" data-id="' +
            personId +
            '">Undo</button></td>'
        );
      },
    });
  });

  $(document).on("click", ".meal2-button", function () {
    var personId = $(this).data("id");
    var el = $(this);
    $.ajax({
      url: "/meal2",
      type: "POST",
      data: { personId: personId },
      success: function (data) {
        // Handle success, such as displaying a success message
        // alert(`Checked in successfully!`);
        el.replaceWith(
          '<td><button class="p-6 unmeal2-button px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none" data-id="' +
            personId +
            '">Undo</button></td>'
        );
      },
    });
  });

  $(document).on("click", ".meal3-button", function () {
    var personId = $(this).data("id");
    var el = $(this);
    $.ajax({
      url: "/meal3",
      type: "POST",
      data: { personId: personId },
      success: function (data) {
        // Handle success, such as displaying a success message
        // alert(`Checked in successfully!`);
        el.replaceWith(
          '<td><button class="p-6 unmeal3-button px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none" data-id="' +
            personId +
            '">Undo</button></td>'
        );
      },
    });
  });

  $(document).on("click", ".uncheckin-button", function () {
    var personId = $(this).data("id");
    var el = $(this);
    $.ajax({
      url: "/uncheckin",
      type: "POST",
      data: { personId: personId },
      success: function (data) {
        // Handle success, such as displaying a success message
        // alert(`Undid check-in successfully!`);
        el.replaceWith(
          '<td><button class="p-6 checkin-button px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none" data-id="' +
            personId +
            '">Check-in</button></td>'
        );
      },
    });
  });

  $(document).on("click", ".unmeal1-button", function () {
    var personId = $(this).data("id");
    var el = $(this);
    $.ajax({
      url: "/unmeal1",
      type: "POST",
      data: { personId: personId },
      success: function (data) {
        // Handle success, such as displaying a success message
        // alert(`Undid check-in successfully!`);
        el.replaceWith(
          '<td><button class="p-6 checkin-button px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none" data-id="' +
            personId +
            '">Meal 1</button></td>'
        );
      },
    });
  });

  $(document).on("click", ".unmeal2-button", function () {
    var personId = $(this).data("id");
    var el = $(this);
    $.ajax({
      url: "/unmeal2",
      type: "POST",
      data: { personId: personId },
      success: function (data) {
        // Handle success, such as displaying a success message
        // alert(`Undid check-in successfully!`);
        el.replaceWith(
          '<td><button class="p-6 checkin-button px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none" data-id="' +
            personId +
            '">Meal 2</button></td>'
        );
      },
    });
  });

  $(document).on("click", ".unmeal3-button", function () {
    var personId = $(this).data("id");
    var el = $(this);
    $.ajax({
      url: "/unmeal3",
      type: "POST",
      data: { personId: personId },
      success: function (data) {
        // Handle success, such as displaying a success message
        // alert(`Undid check-in successfully!`);
        el.replaceWith(
          '<td><button class="p-6 meal3-button px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none" data-id="' +
            personId +
            '">Meal 3</button></td>'
        );
      },
    });
  });
});
