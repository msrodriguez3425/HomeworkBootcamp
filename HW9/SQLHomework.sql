SET SQL_SAFE_UPDATES = 0;

USE sakila;

-- 1a. Display the first and last names of all actors from the table actor.

SELECT first_name, last_name FROM actor;

-- 1b. Display the first and last name of each actor in a single column
-- in upper case letters. Name the column Actor Name.

ALTER TABLE actor
ADD `Actor Name` VARCHAR(100);

UPDATE actor
SET `Actor Name` = CONCAT(first_name,' ',last_name);

SELECT * FROM actor;

-- 2a. You need to find the ID number, first name, and last name of an actor, of
-- whom you know only the first name, "Joe." 
-- What is one query would you use to obtain this information?

SELECT actor_id,first_name,last_name
FROM actor where first_name = "Joe";

-- 2b. Find all actors whose last name contain the letters GEN:

SELECT * FROM actor where last_name LIKE "%GEN%";

-- 2c. Find all actors whose last names contain the letters LI. 
-- This time, order the rows by last name and first name, in that order:

SELECT last_name,first_name FROM actor
WHERE last_name LIKE "%LI%"
ORDER BY last_name,first_name;

-- 2d. Using IN, display the country_id and country columns of the following countries: 
-- Afghanistan, Bangladesh, and China:

SELECT country_id,country FROM country
WHERE country IN ("Afghanistan","Bangladesh","China");

-- 3a. You want to keep a description of each actor. You don't think you will be performing 
-- queries on a description, so create a column in the table actor named description and 
-- use the data type BLOB (Make sure to research the type BLOB, as the difference between it 
-- and VARCHAR are significant).

ALTER TABLE actor
ADD description BLOB;


-- 3b. Very quickly you realize that entering descriptions for each actor is too much effort. 
-- Delete the description column.

ALTER TABLE actor
DROP description;

-- 4a. List the last names of actors, as well as how many actors have that last name.

SELECT last_name,COUNT(*) AS num FROM actor GROUP BY last_name;

-- 4b. List last names of actors and the number of actors who have that last name, but
-- only for names that are shared by at least two actors

SELECT last_name,COUNT(*) AS num FROM actor GROUP BY last_name
HAVING num > 1;

-- 4c. The actor HARPO WILLIAMS was accidentally entered in the actor table as GROUCHO WILLIAMS. 
-- Write a query to fix the record.

UPDATE actor
SET first_name = "HARPO" WHERE first_name = "GROUCHO" AND last_name = "WILLIAMS";

UPDATE actor
SET `Actor Name` = CONCAT(first_name,' ',last_name);

SELECT * FROM actor WHERE last_name = "WILLIAMS";

-- 4d. Perhaps we were too hasty in changing GROUCHO to HARPO. It turns out that
-- GROUCHO was the correct name after all! In a single query, if the first name of the
-- actor is currently HARPO, change it to GROUCHO.

UPDATE actor
SET first_name = "GROUCHO"
WHERE first_name = "HARPO";

SELECT * FROM actor where last_name = "WILLIAMS";


-- 5a. You cannot locate the schema of the address table. Which query would you use to re-create it?

SHOW CREATE TABLE address;

CREATE TABLE address2 (
	address_id SMALLINT(5) UNSIGNED NOT NULL AUTO_INCREMENT,
    address VARCHAR(50) NOT NULL,
    address2 VARCHAR(50) DEFAULT NULL,
	district VARCHAR(20) NOT NULL,
    city_id SMALLINT(5) UNSIGNED NOT NULL,
    postal_code VARCHAR(10) DEFAULT NULL,
    phone VARCHAR(20) NOT NULL,
    location GEOMETRY NOT NULL,
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (address_id),
    KEY idx_fk_city_id (city_id),
    SPATIAL KEY idx_location (location),
    CONSTRAINT fk_address_city FOREIGN KEY (city_id) REFERENCES city (city_id) ON DELETE RESTRICT ON UPDATE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=606 DEFAULT CHARSET = utf8;

-- 6a. Use JOIN to display the first and last names, as well as the address, of each staff member. 
-- Use the tables staff and address:

SELECT staff.first_name,staff.last_name,address.address
FROM staff
JOIN address ON
staff.address_id = address.address_id;

-- 6b. Use JOIN to display the total amount rung up by each staff member in August of 2005. Use tables staff and payment.

SELECT staff.first_name, staff.last_name, SUM(payment.amount) AS total, SUBSTRING(payment.payment_date,1,7) AS Month
FROM staff
JOIN payment ON
staff.staff_id = payment.staff_id
WHERE payment.payment_date LIKE "2005-08-%"
GROUP BY staff.first_name;

-- 6c. List each film and the number of actors who are listed for that film. Use tables film_actor and film. Use inner join.

SELECT film.title, COUNT(film_actor.actor_id) AS COUNT
FROM film
INNER JOIN film_actor ON
film.film_id = film_actor.film_id
GROUP BY film.title;

-- 6d. How many copies of the film Hunchback Impossible exist in the inventory system?

SELECT film.title,COUNT(inventory.film_id) AS Copies
FROM film
INNER JOIN inventory ON
film.film_id = inventory.film_id
WHERE film.title = "HUNCHBACK IMPOSSIBLE"
GROUP BY film.title;

-- 6e. Using the tables payment and customer and the JOIN command, list the total paid
-- by each customer. List the customers alphabetically by last name:

SELECT * FROM payment;

SELECT * FROM customer;

SELECT customer.last_name, customer.first_name, SUM(payment.amount) AS Total
FROM customer
JOIN payment ON
customer.customer_id = payment.customer_id
GROUP BY customer.last_name;

-- 7a. The music of Queen and Kris Kristofferson have seen an unlikely resurgence. 
-- As an unintended consequence, films starting with the letters K and Q have also 
-- soared in popularity. Use subqueries to display the titles of movies starting with 
-- the letters K and Q whose language is English.

SELECT * FROM film
WHERE title IN (SELECT title FROM film
		WHERE title LIKE "K%" OR title LIKE "Q%") 
	  AND language_id IN (SELECT language_id FROM language
		WHERE name = "English");
	
-- 7b. Use subqueries to display all actors who appear in the film Alone Trip.

SELECT * FROM film;   
SELECT * FROM actor; 
SELECT * FROM film_actor;

SELECT first_name, last_name FROM actor
	WHERE actor_id IN (SELECT actor_id FROM film_actor
		WHERE film_id IN (SELECT film_id FROM film WHERE title = "Alone Trip"));
        
-- 7c. You want to run an email marketing campaign in Canada, for which you will need the names and 
-- email addresses of all Canadian customers. Use joins to retrieve this information.

SELECT * FROM customer;-- email, customer id, address id
SELECT * FROM address;-- address id, city_id
SELECT * FROM city;-- city id, coutry id
SELECT * FROM country; -- country id, country

SELECT customer.first_name, customer.last_name, customer.email
FROM customer
JOIN address ON
customer.address_id = address.address_id
JOIN city ON
address.city_id = city.city_id

JOIN country ON
city.country_id = country.country_id
WHERE country.country = "Canada";
        
-- 7d. Sales have been lagging among young families, and you wish to target all family
--  movies for a promotion. Identify all movies categorized as family films.

SELECT * FROM film_category;
SELECT * FROM category WHERE name = "family";
SELECT * FROM film;

SELECT title FROM film
WHERE film_id IN (SELECT film_id FROM film_category
	WHERE category_id IN(SELECT category_id FROM category
		WHERE name = "Family")); 
        
-- 7e. Display the most frequently rented movies in descending order.
SELECT * FROM rental ;
SELECT * FROM inventory;
SELECT * FROM film;
        
SELECT film.title,COUNT(inventory.film_id) AS `Times Rented`
FROM film
JOIN inventory ON
film.film_id = inventory.film_id
GROUP BY film.title
ORDER BY `Times Rented` DESC;


-- 7f. Write a query to display how much business, in dollars, each store brought in.

SELECT * FROM payment; -- amount --> staff_id 
SELECT * FROM staff; -- > staff_id --> store_id
SELECT * FROM store; -- > store_id -- > address_id
SELECT * FROM address; -- > address_id --> address

SELECT address.address AS Store, SUM(payment.amount) AS `Total Business ($)`
FROM address
JOIN store ON address.address_id = store.address_id
JOIN staff ON store.store_id = staff.store_id
JOIN payment ON staff.staff_id = payment.staff_id
GROUP BY store.store_id;

-- 7g. Write a query to display for each store its store ID, city, and country.

SELECT * FROM store; -- STORE_ID --> address_id
SELECT * FROM address; -- > address_id --> city_id
SELECT * FROM city; -- > city_id --> CITY -- > country_id
SELECT * FROM country; -- > country_id --> COUNTRY

SELECT store.store_id, city.city, country.country
FROM store
JOIN address ON store.address_id = address.address_id
JOIN city ON address.city_id = city.city_id
JOIN country ON city.country_id = country.country_id;

-- 7h. List the top five genres in gross revenue in descending order. (Hint: you may
-- need to use the following tables: category, film_category, inventory, payment, and rental.)

 SELECT * FROM category; -- CATEGORY --> category_id 
 SELECT * FROM film_category; -- > category_id --> film_id
 SELECT * FROM inventory; -- > film_id -- > inventory_id
 SELECT * FROM rental; -- > inventory_id --> rental_id
 SELECT * FROM payment; -- > rental_id -- > AMOUNT
 
 SELECT category.name AS Genre, SUM(payment.amount) AS `Gross Revenue`
 FROM category
 JOIN film_category ON category.category_id = film_category.category_id
 JOIN inventory ON film_category.film_id = inventory.film_id
 JOIN rental ON inventory.inventory_id = rental.inventory_id
 JOIN payment ON rental.rental_id = payment.rental_id
 GROUP BY category.name
 ORDER BY `Gross Revenue` DESC
 LIMIT 5;

-- 8a. In your new role as an executive, you would like to have an easy way of viewing
-- the Top five genres by gross revenue. Use the solution from the problem above to create a view.
-- If you haven't solved 7h, you can substitute another query to create a view.

CREATE VIEW Top_5_Genres
AS 
 SELECT category.name AS Genre, SUM(payment.amount) AS `Gross Revenue`
 FROM category
 JOIN film_category ON category.category_id = film_category.category_id
 JOIN inventory ON film_category.film_id = inventory.film_id
 JOIN rental ON inventory.inventory_id = rental.inventory_id
 JOIN payment ON rental.rental_id = payment.rental_id
 GROUP BY category.name
 ORDER BY `Gross Revenue` DESC
 LIMIT 5;
 
SELECT * FROM top_5_genres; 

-- 8b. How would you display the view that you created in 8a?

SELECT * FROM top_5_genres;

-- 8c. You find that you no longer need the view top_five_genres. Write a query to delete it.

DROP VIEW top_5_genres;