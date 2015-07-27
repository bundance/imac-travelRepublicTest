#TravelRepublic Hotels Search#

The TravelRepublic Hotels Search is an exercise that's designed to search through a list of hotel data, formatted
in an JSON file called hotels.json.


##Overview##
The code is written using:
* AngularJs
* Twitter Bootstrap
* underscore.js

###Components###

The core components include:

*main.html - main template, representing the app's view, which contains HTML that renders the formated data
*travelRepublicTestController - controller for the app, acting as the glue between the View and the main business logic
*components/paginator - a separate service, written by myself, that provides functions to control a datatable. The
paginator service is used here to enable the user to iterate through the hotels that have been returned
*components/hotelsJsonAPI* - a set of services that implement the sorting and filtering functionality.

####Main.html template ####
The main.html template provides the user interface onto the app, enabling the user to sort the data that's returned,
and filter it as appropriate. Filtered data can also be sorted, enabling the user to really drill down into the data
to find just the hotel they need.

####TravelRepublicTestController ####
The controller provides functions that wire the user's interactions up to the logic contained within the paginator and
hotelJsonAPI* services, both of which provide the functionality required to sort, filter and present the data according
to the user's actions.

####Paginator service ####
The paginator is a service that I've previously developed, originally called angular-mom-paginator and available here (https://github.com/bundance/angular-mom-paginator).
The paginator enables data to be iterated through, sorted and paginated, without specifying what HTML the developer
must write to implement its features. Accordingly, the paginator provides complete flexibility for displaying data, whilst
providing a powerful set of functions for its easy manipulation.

The paginator has been extended here to provide filtering as well as its existing sorting functionality.

####HotelsJsonAPI* services ####
The set of hotelsJsonAPI* services would normally provide functions that interact with a REST API, as that's what the
paginator was originally intended to interface with. However, the paginator reall doesn't care where it gets its data from -
that's why the hotelsJsonAPI services exist as separate services. Indeed, if you look at the original angular-mom-paginator
repo, you'll see a demo app that interfaces with the GitHub API over REST.

For this test, though, rather than create a server-based REST-API complete with data access and manipulation, the API has
been replicated as a set of functions in hotelsJsonAPI-REST that read in the hotels.json data from a file, and sort and
filter it as required. This functionality would normally be provided by a server-based backend, but it provided here in the
 client for ease of development.

Note: clearly this architecture isn't optimally performant. However, it should be good enough for this exercise, and so
should be seen as a Minimum Viable Product, rather than a complete production-ready solution.


###Tests###
I wrote an extensive set of tests for the paginator service, which have been included in this app. However, I've not
written any additional tests due to time constraints.

You'll need the Karma test runner to run the tests, which can be found in `/test/spec`. More details can be found in the
 angular-mom-paginator repo here.









