-- CS4400: Introduction to Database Systems (Fall 2022)
-- Project Phase III: Stored Procedures SHELL [v2] Wednesday, November 30, 2022
set global transaction isolation level serializable;
set global SQL_MODE = 'ANSI,TRADITIONAL';
set names utf8mb4;
set SQL_SAFE_UPDATES = 0;

use restaurant_supply_express;
-- -----------------------------------------------------------------------------
-- stored procedures and views
-- -----------------------------------------------------------------------------
/* Standard Procedure: If one or more of the necessary conditions for a procedure to
be executed is false, then simply have the procedure halt execution without changing
the database state. Do NOT display any error messages, etc. */

-- [1] add_owner()
-- -----------------------------------------------------------------------------
/* This stored procedure creates a new owner.  A new owner must have a unique
username.  Also, the new owner is not allowed to be an employee. */
-- -----------------------------------------------------------------------------
drop procedure if exists add_owner;
delimiter //
create procedure add_owner (in ip_username varchar(40), in ip_first_name varchar(100),
	in ip_last_name varchar(100), in ip_address varchar(500), in ip_birthdate date)
sp_main: begin
    -- ensure new owner has a unique username
    if not (
		not exists (select 1 from users where username = ip_username)
    ) then leave sp_main; end if;
    insert into users values (ip_username, ip_first_name, ip_last_name, ip_address, ip_birthdate);
    insert into restaurant_owners values (ip_username);
end //
delimiter ;

-- [2] add_employee()
-- -----------------------------------------------------------------------------
/* This stored procedure creates a new employee without any designated pilot or
worker roles.  A new employee must have a unique username unique tax identifier. */
-- -----------------------------------------------------------------------------
drop procedure if exists add_employee;
delimiter //
create procedure add_employee (in ip_username varchar(40), in ip_first_name varchar(100),
	in ip_last_name varchar(100), in ip_address varchar(500), in ip_birthdate date,
    in ip_taxID varchar(40), in ip_hired date, in ip_employee_experience integer,
    in ip_salary integer)
sp_main: begin
    -- ensure new owner has a unique username
    -- ensure new employee has a unique tax identifier
    if not (
		not exists (select 1 from users where username = ip_username) and 
        not exists (select 1 from employees where taxID = ip_taxID or username = ip_username)
     ) then leave sp_main; end if;
    insert into users values
		(ip_username, ip_first_name, ip_last_name, ip_address, ip_birthdate);
    insert into employees values
		(ip_username, ip_taxID, ip_hired, ip_employee_experience, ip_salary);
end //
delimiter ;

-- [3] add_pilot_role()
-- -----------------------------------------------------------------------------
/* This stored procedure adds the pilot role to an existing employee.  The
employee/new pilot must have a unique license identifier. */
-- -----------------------------------------------------------------------------
drop procedure if exists add_pilot_role;
delimiter //
create procedure add_pilot_role (in ip_username varchar(40), in ip_licenseID varchar(40),
	in ip_pilot_experience integer)
sp_main: begin
    -- ensure new employee exists
    -- ensure new pilot has a unique license identifier
    if not (
		exists (select 1 from employees where username = ip_username) and 
        not exists (select 1 from pilots where username = ip_username or licenseID = ip_licenseID)
    ) then leave sp_main; end if;
	insert into pilots values (ip_username, ip_licenseID, ip_pilot_experience); 
end //
delimiter ;

-- [4] add_worker_role()
-- -----------------------------------------------------------------------------
/* This stored procedure adds the worker role to an existing employee. */
-- -----------------------------------------------------------------------------
drop procedure if exists add_worker_role;
delimiter //
create procedure add_worker_role (in ip_username varchar(40))
sp_main: begin
    -- ensure new employee exists
    if exists (select 1 from employees where username = ip_username) then 
		insert ignore into workers values (ip_username); 
	end if;
end //
delimiter ;

-- [5] add_ingredient()
-- -----------------------------------------------------------------------------
/* This stored procedure creates a new ingredient.  A new ingredient must have a
unique barcode. */
-- -----------------------------------------------------------------------------
drop procedure if exists add_ingredient;
delimiter //
create procedure add_ingredient (in ip_barcode varchar(40), in ip_iname varchar(100),
	in ip_weight integer)
sp_main: begin
	-- ensure new ingredient doesn't already exist
    insert ignore into ingredients values (ip_barcode, ip_iname, ip_weight);
end //
delimiter ;

-- [6] add_drone()
-- -----------------------------------------------------------------------------
/* This stored procedure creates a new drone.  A new drone must be assigned 
to a valid delivery service and must have a unique tag.  Also, it must be flown
by a valid pilot initially (i.e., pilot works for the same service), but the pilot
can switch the drone to working as part of a swarm later. And the drone's starting
location will always be the delivery service's home base by default. */
-- -----------------------------------------------------------------------------
drop procedure if exists add_drone;
delimiter //
create procedure add_drone (in ip_id varchar(40), in ip_tag integer, in ip_fuel integer,
	in ip_capacity integer, in ip_sales integer, in ip_flown_by varchar(40))
sp_main: begin
	-- ensure new drone doesn't already exist
    -- ensure that the delivery service exists
    -- ensure that a valid pilot will control the drone
    if not (
		not exists (select 1 from drones where (id, tag) = (ip_id, ip_tag)) and
		exists (select 1 from delivery_services where id = ip_id) and
        exists (select 1 from pilots where username = ip_flown_by) and
        exists (select 1 from work_for where username = ip_flown_by and id = ip_id)
	) then leave sp_main; end if;
    insert into drones values
		(ip_id, ip_tag, ip_fuel, ip_capacity, ip_sales, ip_flown_by, null, null,
        (select home_base from delivery_services where id = ip_id));
end //
delimiter ;

-- [7] add_restaurant()
-- -----------------------------------------------------------------------------
/* This stored procedure creates a new restaurant.  A new restaurant must have a
unique (long) name and must exist at a valid location, and have a valid rating.
And a resturant is initially "independent" (i.e., no owner), but will be assigned
an owner later for funding purposes. */
-- -----------------------------------------------------------------------------
drop procedure if exists add_restaurant;
delimiter //
create procedure add_restaurant (in ip_long_name varchar(40), in ip_rating integer,
	in ip_spent integer, in ip_location varchar(40))
sp_main: begin
	-- ensure new restaurant doesn't already exist
    -- ensure that the location is valid
    -- ensure that the rating is valid (i.e., between 1 and 5 inclusively)
    if not (
		not exists (select 1 from restaurants where long_name = ip_long_name) and
		exists (select 1 from locations where label = ip_location) and
        (1 <= ip_rating and ip_rating <= 5)
	) then leave sp_main; end if;
	insert into restaurants values
		(ip_long_name, ip_rating, ip_spent, ip_location, null);
end //
delimiter ;

-- [8] add_service()
-- -----------------------------------------------------------------------------
/* This stored procedure creates a new delivery service.  A new service must have
a unique identifier, along with a valid home base and manager. */
-- -----------------------------------------------------------------------------
drop procedure if exists add_service;
delimiter //
create procedure add_service (in ip_id varchar(40), in ip_long_name varchar(100),
	in ip_home_base varchar(40), in ip_manager varchar(40))
sp_main: begin
	-- ensure new delivery service doesn't already exist
    -- ensure that the home base location is valid
    -- ensure that the manager is valid
    if not exists (select 1 from delivery_services where id = ip_id) and 
	    exists (select 1 from locations where label = ip_home_base) and
        exists (select 1 from workers where username = ip_manager) and
        not exists (select 1 from work_for where username = ip_manager) and
        not exists (select 1 from delivery_services where manager = ip_manager)
	then
		insert into delivery_services values 
			(ip_id, ip_long_name, ip_home_base, ip_manager);
		insert into work_for values (ip_manager, ip_id);
	end if;
end //
delimiter ;

-- [9] add_location()
-- -----------------------------------------------------------------------------
/* This stored procedure creates a new location that becomes a new valid drone
destination.  A new location must have a unique combination of coordinates.  We
could allow for "aliased locations", but this might cause more confusion that
it's worth for our relatively simple system. */
-- -----------------------------------------------------------------------------
drop procedure if exists add_location;
delimiter //
create procedure add_location (in ip_label varchar(40), in ip_x_coord integer,
	in ip_y_coord integer, in ip_space integer)
sp_main: begin
	-- ensure new location doesn't already exist
    -- ensure that the coordinate combination is distinct
    if exists (select 1 from locations where x_coord = ip_x_coord and y_coord = ip_y_coord)
    then leave sp_main; end if;
    insert ignore into locations values (ip_label, ip_x_coord, ip_y_coord, ip_space);
end //
delimiter ;

-- [10] start_funding()
-- -----------------------------------------------------------------------------
/* This stored procedure opens a channel for a restaurant owner to provide funds
to a restaurant. If a different owner is already providing funds, then the current
owner is replaced with the new owner.  The owner and restaurant must be valid. */
-- -----------------------------------------------------------------------------
drop procedure if exists start_funding;
delimiter //
create procedure start_funding (in ip_owner varchar(40), in ip_long_name varchar(40))
sp_main: begin
	-- ensure the owner and restaurant are valid
    if not (
		exists (select 1 from restaurants where long_name = ip_long_name) and
        exists (select 1 from restaurant_owners where username = ip_owner)
    ) then leave sp_main; end if;
    update restaurants set funded_by = ip_owner where long_name = ip_long_name;
end //
delimiter ;

-- [11] hire_employee()
-- -----------------------------------------------------------------------------
/* This stored procedure hires an employee to work for a delivery service.
Employees can be combinations of workers and pilots. If an employee is actively
controlling drones or serving as manager for a different service, then they are
not eligible to be hired.  Otherwise, the hiring is permitted. */
-- -----------------------------------------------------------------------------
drop procedure if exists hire_employee;
delimiter //
create procedure hire_employee (in ip_username varchar(40), in ip_id varchar(40))
sp_main: begin
	-- ensure that the employee hasn't already been hired
	-- ensure that the employee and delivery service are valid
    -- ensure that the employee isn't a manager for another service
	-- ensure that the employee isn't actively controlling drones for another service
    if not exists (select 1 from work_for where username = ip_username and id = ip_id) and 
        not exists (select 1 from drones where flown_by = ip_username and id != ip_id) and     
        not exists (select 1 from delivery_services where manager = ip_username and id != ip_id) and 
        exists (select 1 from employees where username = ip_username) and
        exists (select 1 from delivery_services where id = ip_id)
	then
		insert into work_for values (ip_username, ip_id);
	end if;
end //
delimiter ;

-- [12] fire_employee()
-- -----------------------------------------------------------------------------
/* This stored procedure fires an employee who is currently working for a delivery
service.  The only restrictions are that the employee must not be: [1] actively
controlling one or more drones; or, [2] serving as a manager for the service.
Otherwise, the firing is permitted. */
-- -----------------------------------------------------------------------------
drop procedure if exists fire_employee;
delimiter //
create procedure fire_employee (in ip_username varchar(40), in ip_id varchar(40))
sp_main: begin
	-- ensure that the employee is currently working for the service
    -- ensure that the employee isn't an active manager
	-- ensure that the employee isn't controlling any drones
    if exists(select 1 from work_for where username = ip_username and id = ip_id) and
		not exists (select 1 from delivery_services where manager = ip_username and id = ip_id) and 
        not exists (select 1 from drones where flown_by = ip_username and id = ip_id)
	then
		delete from work_for where username = ip_username and id = ip_id;
	else
		leave sp_main;
	end if;
end //
delimiter ;

-- [13] manage_service()
-- -----------------------------------------------------------------------------
/* This stored procedure appoints an employee who is currently hired by a delivery
service as the new manager for that service.  The only restrictions are that: [1]
the employee must not be working for any other delivery service; and, [2] the
employee can't be flying drones at the time.  Otherwise, the appointment to manager
is permitted.  The current manager is simply replaced.  And the employee must be
granted the worker role if they don't have it already. */
-- -----------------------------------------------------------------------------
drop procedure if exists manage_service;
delimiter //
create procedure manage_service (in ip_username varchar(40), in ip_id varchar(40))
sp_main: begin
	-- ensure that the employee is currently working for the service
	-- ensure that the employee is not flying any drones
    -- ensure that the employee isn't working for any other services
    -- add the worker role if necessary
    
    -- check that employee is working for this service
    IF NOT EXISTS(SELECT 1 from work_for WHERE username = ip_username AND id = ip_id) THEN
		LEAVE sp_main;
	END IF;
    
    -- check that employee is ONLY working for this service
    IF (SELECT ifnull(COUNT(*), 0) from work_for WHERE username = ip_username) > 1 THEN
		LEAVE sp_main;
	END IF;
    
    -- check that employee is not flying any drones
    IF EXISTS(SELECT 1 from drones WHERE flown_by = ip_username) THEN
		LEAVE sp_main;
	END IF;

    -- Add employee to worker table if not already in it
    IF NOT EXISTS(SELECT 1 from workers WHERE username = ip_username) THEN
		INSERT into workers(username) VALUES (ip_username);
	END IF;
    
    -- All necessary conditions met, appoint employee as new manager of delivery service
    UPDATE delivery_services SET manager = ip_username WHERE id = ip_id;
	
end //
delimiter ;

-- [14] takeover_drone()
-- -----------------------------------------------------------------------------
/* This stored procedure allows a valid pilot to take control of a lead drone owned
by the same delivery service, whether it's a "lone drone" or the leader of a swarm.
The current controller of the drone is simply relieved of those duties. And this
should only be executed if a "leader drone" is selected. */
-- -----------------------------------------------------------------------------
drop procedure if exists takeover_drone;
delimiter //
create procedure takeover_drone (in ip_username varchar(40), in ip_id varchar(40),
	in ip_tag integer)
sp_main: begin
    -- ensure that the employee is currently working for the service
    -- ensure that the selected drone is owned by the same service and is a leader and not follower
    -- ensure that the employee isn't a manager
    -- ensure that the employee is a valid pilot
    
    -- check if username belongs to a valid pilot
    IF NOT EXISTS (select 1 FROM pilots where username = ip_username) THEN
		LEAVE sp_main;
	END IF;
	
    -- ensure that the employee isn't a manager
    if ip_username in (select manager from delivery_services) then
    	LEAVE sp_main;
	END IF;
    
    -- check if pilot is working for the delivery service specified by ip_id
    IF NOT EXISTS (select 1 from work_for where username = ip_username AND id = ip_id) THEN
		LEAVE sp_main;
	END IF;
    
    -- check if drone specified by ip_tag is a Leader drone and belongs to the delivery servicve specified by ip_id
    IF NOT EXISTS (select 1 from drones where id = ip_id AND tag = ip_tag AND swarm_id IS NULL and swarm_tag IS NULL) THEN
		LEAVE sp_main;
	END IF;
    
    -- All necessary conditions met, let pilot takeover drone
    UPDATE drones SET flown_by = ip_username WHERE id = ip_id AND tag = ip_tag;
    
end //
delimiter ;

-- [15] join_swarm()
-- -----------------------------------------------------------------------------
/* This stored procedure takes a drone that is currently being directly controlled
by a pilot and has it join a swarm (i.e., group of drones) led by a different
directly controlled drone. A drone that is joining a swarm connot be leading a
different swarm at this time.  Also, the drones must be at the same location, but
they can be controlled by different pilots. */
-- -----------------------------------------------------------------------------
drop procedure if exists join_swarm;
delimiter //
create procedure join_swarm (in ip_id varchar(40), in ip_tag integer,
	in ip_swarm_leader_tag integer)
sp_main: begin
    -- ensure that the swarm leader is a different drone
    -- ensure that the drone joining the swarm is valid and owned by the service
    -- ensure that the drone joining the swarm is not already leading a swarm
    -- ensure that the swarm leader drone is directly controlled
    -- ensure that the drones are at the same location
	
    -- Check that joining drone and leader drone are different
    IF ip_tag = ip_swarm_leader_tag THEN
		LEAVE sp_main;
	END IF;
    
    -- Check that both joining drone and leader drone are directly controlled by a pilot
    IF (SELECT flown_by from drones WHERE id = ip_id AND tag = ip_tag) is NULL OR
	    (SELECT flown_by from drones WHERE id = ip_id AND tag = ip_swarm_leader_tag) is NULL
	THEN LEAVE sp_main;
    END IF;
    
    -- Check that joining drone and leader drone are both valid, in same location, and belong to same delivery service
    IF (SELECT id, hover from drones WHERE id = ip_id AND tag = ip_tag) != (SELECT id, hover from drones WHERE id = ip_id AND tag = ip_swarm_leader_tag) THEN
		LEAVE sp_main;
	END IF;
    
    -- Check that joining drone doesn't have any follower drones
    IF  EXISTS(select 1 from drones where swarm_id = ip_id AND swarm_tag = ip_tag) THEN
		LEAVE sp_main;
	END IF;
    
    -- All necessary conditions met, let drone join a different swarm
    UPDATE drones SET flown_by = NULL, swarm_id = ip_id, swarm_tag = ip_swarm_leader_tag WHERE id = ip_id AND tag = ip_tag;
    
end //
delimiter ;

-- [16] leave_swarm()
-- -----------------------------------------------------------------------------
/* This stored procedure takes a drone that is currently in a swarm and returns
it to being directly controlled by the same pilot who's controlling the swarm. */
-- -----------------------------------------------------------------------------
drop procedure if exists leave_swarm;
delimiter //
create procedure leave_swarm (in ip_id varchar(40), in ip_tag integer)
sp_main: begin
    -- ensure that the selected drone is owned by the service and flying in a swarm
	
    -- Declare variables to store pilot of current swarm
    DECLARE leaderDroneTag integer;
    DECLARE swarmPilot varchar(40);
    
    -- check that selected drone is owned by the service
    IF NOT EXISTS(SELECT 1 FROM drones WHERE id = ip_id AND tag = ip_tag) THEN
		LEAVE sp_main;
	END IF;
    
    -- check that selected drone is currently in a swarm
    IF (SELECT swarm_id FROM drones WHERE id = ip_id AND tag = ip_tag) IS NULL THEN
		LEAVE sp_main;
        
    ELSEIF (SELECT swarm_tag FROM drones WHERE id = ip_id AND tag = ip_tag) IS NULL THEN
		LEAVE sp_main;
	END IF;
    
    -- initialize variables to store pilot of current swarm
    SELECT swarm_tag into leaderDroneTag FROM drones WHERE id = ip_id AND tag = ip_tag;
    SELECT flown_by into swarmPilot FROM drones WHERE id = ip_id AND tag = leaderDroneTag;
    
    -- All necessary conditions met, let drone leave the swarm and be directly controlled by the same swarm pilot
    UPDATE drones 
    SET flown_by = swarmPilot, swarm_id = NULL, swarm_tag = NULL
    WHERE id = ip_id AND tag = ip_tag;
    
end //
delimiter ;

-- [17] load_drone()
-- -----------------------------------------------------------------------------
/* This stored procedure allows us to add some quantity of fixed-size packages of
a specific ingredient to a drone's payload so that we can sell them for some
specific price to other restaurants.  The drone can only be loaded if it's located
at its delivery service's home base, and the drone must have enough capacity to
carry the increased number of items.

The change/delta quantity value must be positive, and must be added to the quantity
of the ingredient already loaded onto the drone as applicable.  And if the ingredient
already exists on the drone, then the existing price must not be changed. */
-- -----------------------------------------------------------------------------
drop procedure if exists load_drone;
delimiter //
create procedure load_drone (in ip_id varchar(40), in ip_tag integer, in ip_barcode varchar(40),
	in ip_more_packages integer, in ip_price integer)
sp_main: begin
	-- ensure that the drone being loaded is owned by the service
	-- ensure that the ingredient is valid
    -- ensure that the drone is located at the service home base
	-- ensure that the quantity of new packages is greater than zero
	-- ensure that the drone has sufficient capacity to carry the new packages
    -- add more of the ingredient to the drone
    if not (
		exists (select 1 from drones where (id, tag) = (ip_id, ip_tag)) and
        exists (select 1 from ingredients where barcode = ip_barcode)
    ) then leave sp_main; end if;
    
    select hover, capacity into @hover, @capa from drones where (id, tag) = (ip_id, ip_tag);
    select coalesce(sum(quantity), 0) into @loads from payload where (id, tag) = (ip_id, ip_tag);
    if not (
        @hover = (select home_base from delivery_services where id = ip_id) and
		ip_more_packages > 0 and
        @loads + ip_more_packages <= @capa and
		not exists (select 1 from payload 
					where (id, tag) = (ip_id, ip_tag) and 
						  barcode = ip_barcode and price != ip_price)
    ) then leave sp_main; end if;
    
    insert into payload values (ip_id, ip_tag, ip_barcode, ip_more_packages, ip_price)
		on duplicate key update quantity = quantity + ip_more_packages;
end //
delimiter ;

-- [18] refuel_drone()
-- -----------------------------------------------------------------------------
/* This stored procedure allows us to add more fuel to a drone. The drone can only
be refueled if it's located at the delivery service's home base. */
-- -----------------------------------------------------------------------------
drop procedure if exists refuel_drone;
delimiter //
create procedure refuel_drone (in ip_id varchar(40), in ip_tag integer, in ip_more_fuel integer)
sp_main: begin
	-- ensure that the drone being switched is valid and owned by the service
    -- ensure that the drone is located at the service home base
    if not (
		exists (select 1 from drones where (id, tag) = (ip_id, ip_tag)) and
        (select hover from drones where (id, tag) = (ip_id, ip_tag)) = 
			(select home_base from delivery_services where id = ip_id)
	) then leave sp_main; end if;
    update drones set fuel = fuel + ip_more_fuel where (id, tag) = (ip_id, ip_tag);
end //
delimiter ;

-- [19] fly_drone()
-- -----------------------------------------------------------------------------
/* This stored procedure allows us to move a single or swarm of drones to a new
location (i.e., destination). The main constraints on the drone(s) being able to
move to a new location are fuel and space.  A drone can only move to a destination
if it has enough fuel to reach the destination and still move from the destination
back to home base.  And a drone can only move to a destination if there's enough
space remaining at the destination.  For swarms, the flight directions will always
be given to the lead drone, but the swarm must always stay together. */
-- -----------------------------------------------------------------------------
drop function if exists fuel_required;
delimiter //
create function fuel_required (ip_departure varchar(40), ip_arrival varchar(40))
	returns integer reads sql data
begin
	if (ip_departure = ip_arrival) then return 0;
    else return (select 1 + truncate(sqrt(power(arrival.x_coord - departure.x_coord, 2) + power(arrival.y_coord - departure.y_coord, 2)), 0) as fuel
		from (select x_coord, y_coord from locations where label = ip_departure) as departure,
        (select x_coord, y_coord from locations where label = ip_arrival) as arrival);
	end if;
end //
delimiter ;

drop procedure if exists fly_drone;
delimiter //
create procedure fly_drone (in ip_id varchar(40), in ip_tag integer, in ip_destination varchar(40))
sp_main: begin
    -- ensure that the lead drone being flown is directly controlled and owned by the service
    -- ensure that the destination is a valid location
    -- ensure that the drone isn't already at the location
    -- ensure that the drone/swarm has enough fuel to reach the destination and (then) home base
    -- ensure that the drone/swarm has enough space at the destination for the flight
    
    -- Declare variables to store locations and amount of fuel needed to go to destination and then back to home base
    DECLARE current_location varchar(40);
    DECLARE home_location varchar(40);
	DECLARE fuel_needed integer;
    
    -- Declare variable to store available number of drones in swarm
    DECLARE swarm_size integer;
    DECLARE space_available integer;
    
    -- check that lead drone is directly controlled by a pilot and is owned by delivery service
    IF NOT EXISTS(SELECT flown_by from drones WHERE id = ip_id AND tag = ip_tag) OR (SELECT flown_by from drones WHERE id = ip_id AND tag = ip_tag) IS NULL THEN
		LEAVE sp_main;
	END IF;
    
    -- check that destination is a valid location
    IF NOT EXISTS(SELECT label from locations WHERE label = ip_destination) THEN
		LEAVE sp_main;
	END IF;
    
    -- check that drone isn't already at destination location
    IF EXISTS(SELECT hover FROM drones WHERE id = ip_id AND tag = ip_tag AND hover = ip_destination) THEN
		LEAVE sp_main;
	END IF;
    
    -- initialize the location variables
    SELECT hover into current_location from drones WHERE id = ip_id AND tag = ip_tag;
    SELECT home_base into home_location from delivery_services WHERE id = ip_id;
    SET fuel_needed = fuel_required(current_location, ip_destination) + fuel_required(ip_destination, home_location);
    
    -- check that all drones in swarm have enough fuel to go to destination and then back to home base
    IF (SELECT MIN(fuel) FROM drones WHERE id = ip_id AND tag = ip_tag) < fuel_needed THEN
		LEAVE sp_main;
    
    ELSEIF (SELECT MIN(fuel) FROM drones WHERE swarm_id = ip_id AND swarm_tag = ip_tag) < fuel_needed THEN
		LEAVE sp_main;
	END IF;
    
    -- initialize the swarm_size variable
    SELECT COUNT(*) + 1 INTO swarm_size FROM drones WHERE swarm_id = ip_id AND swarm_tag = ip_tag;
    
    -- initialize the space_available variable
    SELECT space INTO space_available FROM locations WHERE label = ip_destination;
    
    -- check that destination has enough space for all drones in swarm
    IF swarm_size > space_available THEN
		LEAVE sp_main;
	END IF;
    
    -- All necessary conditions met, let swarm move to destination location, decrease fuel for each drone
    UPDATE drones 
    SET hover = ip_destination, fuel = fuel - fuel_required(current_location, ip_destination) 
    WHERE id = ip_id AND tag = ip_tag OR swarm_id = ip_id AND swarm_tag = ip_tag;
    
    -- Decrease space for destination location and increase space for current location
    UPDATE locations SET space = space - swarm_size WHERE label = ip_destination;
    UPDATE locations SET space = space + swarm_size WHERE label = current_location;
    
end //
delimiter ;

-- [20] purchase_ingredient()
-- -----------------------------------------------------------------------------
/* This stored procedure allows a restaurant to purchase ingredients from a drone
at its current location.  The drone must have the desired quantity of the ingredient
being purchased.  And the restaurant must have enough money to purchase the
ingredients.  If the transaction is otherwise valid, then the drone and restaurant
information must be changed appropriately.  Finally, we need to ensure that all
quantities in the payload table (post transaction) are greater than zero. */
-- -----------------------------------------------------------------------------
drop procedure if exists purchase_ingredient;
delimiter //
create procedure purchase_ingredient (in ip_long_name varchar(40), in ip_id varchar(40),
	in ip_tag integer, in ip_barcode varchar(40), in ip_quantity integer)
sp_main: begin
	-- ensure that the restaurant is valid
    -- ensure that the drone is valid and exists at the resturant's location
	-- ensure that the drone has enough of the requested ingredient
	-- update the drone's payload
    -- update the monies spent and gained for the drone and restaurant
    -- ensure all quantities in the payload table are greater than zero
	
	if exists (select 1 from restaurants where long_name = ip_long_name) and
	    (select hover from drones where (id, tag) = (ip_id, ip_tag))
		    = (select location from restaurants where long_name = ip_long_name) and
        exists (select 1 from payload where (id, tag) = (ip_id, ip_tag) and barcode = ip_barcode and quantity >= ip_quantity)
	then 
		select price * ip_quantity INTO @total_price from payload where (id, tag) = (ip_id, ip_tag) and barcode = ip_barcode;
		update payload
			set quantity = quantity - ip_quantity
			where (id, tag) = (ip_id, ip_tag) and barcode = ip_barcode;
		-- if any quantity in payload table <= 0 then it shouldn't exist there as there is no use
		delete from payload where quantity <= 0;
        update drones
			set sales = sales + @total_price
			where (id, tag) = (ip_id, ip_tag);
		update restaurants
			set spent = spent + @total_price
			where long_name = ip_long_name;
	else 
    leave sp_main; end if;
end //
delimiter ;

-- [21] remove_ingredient()
-- -----------------------------------------------------------------------------
/* This stored procedure removes an ingredient from the system.  The removal can
occur if, and only if, the ingredient is not being carried by any drones. */
-- -----------------------------------------------------------------------------
drop procedure if exists remove_ingredient;
delimiter //
create procedure remove_ingredient (in ip_barcode varchar(40))
sp_main: begin
	-- ensure that the ingredient exists
    -- ensure that the ingredient is not being carried by any drones
    if not(
		exists (select 1 from ingredients where barcode = ip_barcode) and
		not exists (select 1 from payload where barcode = ip_barcode) 
	) then leave sp_main; end if;
    delete from ingredients where barcode = ip_barcode;
end //
delimiter ;

-- [22] remove_drone()
-- -----------------------------------------------------------------------------
/* This stored procedure removes a drone from the system.  The removal can
occur if, and only if, the drone is not carrying any ingredients, and if it is
not leading a swarm. */
-- -----------------------------------------------------------------------------
drop procedure if exists remove_drone;
delimiter //
create procedure remove_drone (in ip_id varchar(40), in ip_tag integer)
sp_main: begin
	-- ensure that the drone exists
    -- ensure that the drone is not carrying any ingredients
	-- ensure that the drone is not leading a swarm
    if not (
		exists (select 1 from drones where (id, tag) = (ip_id, ip_tag)) and
		not exists (select 1 from payload where (id, tag) = (ip_id, ip_tag)) and
        not exists (select 1 from drones where (swarm_id, swarm_tag) = (ip_id, ip_tag))
	) then leave sp_main; end if;
	delete from drones where (id, tag) = (ip_id, ip_tag);
end //
delimiter ;

-- [23] remove_pilot_role()
-- -----------------------------------------------------------------------------
/* This stored procedure removes a pilot from the system.  The removal can
occur if, and only if, the pilot is not controlling any drones.  Also, if the
pilot also has a worker role, then the worker information must be maintained;
otherwise, the pilot's information must be completely removed from the system. */
-- -----------------------------------------------------------------------------
drop procedure if exists remove_pilot_role;
delimiter //
create procedure remove_pilot_role (in ip_username varchar(40))
sp_main: begin
	-- ensure that the pilot exists
    -- ensure that the pilot is not controlling any drones
    -- remove all remaining information unless the pilot is also a worker
    if exists(select 1 from pilots where username = ip_username) and
	not exists (select 1 from drones where flown_by = ip_username) 
    then
		delete from pilots WHERE username = ip_username;
		if not exists(select 1 from workers where username = ip_username)
        then
            delete from employees WHERE username = ip_username;
            delete from users WHERE username = ip_username;
		end if;
    else
		leave sp_main; end if;
end //
delimiter ;

-- [24] display_owner_view()
-- -----------------------------------------------------------------------------
/* This view displays information in the system from the perspective of an owner.
For each owner, it includes the owner's information, along with the number of
restaurants for which they provide funds and the number of different places where
those restaurants are located.  It also includes the highest and lowest ratings
for each of those restaurants, as well as the total amount of debt based on the
monies spent purchasing ingredients by all of those restaurants. And if an owner
doesn't fund any restaurants then display zeros for the highs, lows and debt. */
-- -----------------------------------------------------------------------------
create or replace view display_owner_view as
SELECT 
    username,
    first_name,
    last_name,
    address,
    IFNULL(COUNT(long_name), 0) AS num_restaurants,
    IFNULL(COUNT(DISTINCT location), 0) AS num_places,
    IFNULL(MAX(rating), 0) AS highs,
    IFNULL(MIN(rating), 0) AS lows,
    IFNULL(SUM(spent), 0) AS debt
FROM
    restaurant_owners
        NATURAL JOIN
    users
        LEFT JOIN
    restaurants ON funded_by = username
group by
	username;

-- [25] display_employee_view()
-- -----------------------------------------------------------------------------
/* This view displays information in the system from the perspective of an employee.
For each employee, it includes the username, tax identifier, hiring date and
experience level, along with the license identifer and piloting experience (if
applicable), and a 'yes' or 'no' depending on the manager status of the employee. */
-- -----------------------------------------------------------------------------
create or replace view display_employee_view as
select employees.username as username, taxID, salary, hired, employees.experience as employee_experience, 
	IFNULL(licenseID, 'n/a') as licenseID, IFNULL(pilots.experience, 'n/a') as piloting_experience,
	IF(manager IS NULL, 'no' , 'yes') as manager_status 
from employees
left join pilots on employees.username = pilots.username
left join delivery_services on manager = employees.username;

-- [26] display_pilot_view()
-- -----------------------------------------------------------------------------
/* This view displays information in the system from the perspective of a pilot.
For each pilot, it includes the username, licenseID and piloting experience, along
with the number of drones that they are controlling. */
-- -----------------------------------------------------------------------------
create or replace view display_pilot_view as
select 
	username, licenseID, experience, 
    count(hover) as num_drones,
    count(distinct hover) as num_locations
from pilots
	left join 
		(select 
			 coalesce(d1.flown_by, d2.flown_by) as swarm_flown_by, 
             d1.hover
         from drones d1 left join drones d2
         on (d1.swarm_id, d1.swarm_tag) = (d2.id, d2.tag)) as d
        on d.swarm_flown_by = username
group by username;

-- [27] display_location_view()
-- -----------------------------------------------------------------------------
/* This view displays information in the system from the perspective of a location.
For each location, it includes the label, x- and y- coordinates, along with the
number of restaurants, delivery services and drones at that location. */
-- -----------------------------------------------------------------------------
create or replace view display_location_view as
select label, x_coord, y_coord, 
	(select count(*) from restaurants where label = location) as num_restaurants,
    (select count(*) from delivery_services where label = home_base) as num_delivery_services,
    (select count(*) from drones where label = hover) as num_drones
from locations;

-- [28] display_ingredient_view()
-- -----------------------------------------------------------------------------
/* This view displays information in the system from the perspective of the ingredients.
For each ingredient that is being carried by at least one drone, it includes a list of
the various locations where it can be purchased, along with the total number of packages
that can be purchased and the lowest and highest prices at which the ingredient is being
sold at that location. */
-- -----------------------------------------------------------------------------
create or replace view display_ingredient_view as
select
	iname as ingredient_name, 
    hover as location, 
    ifnull(sum(quantity), 0) as amount_available, 
    ifnull(min(price), 0) as low_price, 
    ifnull(max(price), 0) as high_price
from ingredients
natural left join payload
natural left join drones
group by barcode, hover;

-- [29] display_service_view()
-- -----------------------------------------------------------------------------
/* This view displays information in the system from the perspective of a delivery
service.  It includes the identifier, name, home base location and manager for the
service, along with the total sales from the drones.  It must also include the number
of unique ingredients along with the total cost and weight of those ingredients being
carried by the drones. */
-- -----------------------------------------------------------------------------
create or replace view display_service_view as
WITH Rtable(id, revenue) AS
	(SELECT id, SUM(sales) AS revenue 
	FROM drones as D
	GROUP BY id)
SELECT delivery_services.*,
	ifnull(revenue, 0) as revenue,
    ifnull(count(distinct barcode), 0) AS ingredients_carried,
	ifnull(sum(quantity * price), 0) AS cost_carried,
	ifnull(sum(quantity * weight), 0) AS weight_carried
FROM delivery_services natural left JOIN payload natural left JOIN ingredients left join Rtable on delivery_services.id = Rtable.id
GROUP BY id;
