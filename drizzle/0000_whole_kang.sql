CREATE TABLE `alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`missionId` int NOT NULL,
	`title` varchar(160) NOT NULL,
	`description` text NOT NULL,
	`severity` enum('info','watch','critical') NOT NULL DEFAULT 'watch',
	`acknowledged` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`missionId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`type` varchar(80) NOT NULL,
	`status` enum('in_transit','standby','service_due','offline') NOT NULL DEFAULT 'standby',
	`signal` int NOT NULL DEFAULT 0,
	`location` varchar(120),
	`serviceDue` boolean NOT NULL DEFAULT false,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `expeditionRoutes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`missionId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`corridor` varchar(120) NOT NULL,
	`status` enum('planned','active','complete','watch') NOT NULL DEFAULT 'planned',
	`distanceKm` int NOT NULL DEFAULT 0,
	`etaUtc` timestamp,
	`iceRisk` enum('low','moderate','high') NOT NULL DEFAULT 'low',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `expeditionRoutes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inventoryItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`missionId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`category` varchar(64) NOT NULL,
	`quantity` int NOT NULL DEFAULT 0,
	`unit` varchar(24) NOT NULL,
	`targetQuantity` int NOT NULL DEFAULT 0,
	`daysCover` int NOT NULL DEFAULT 0,
	`status` enum('nominal','watch','critical') NOT NULL DEFAULT 'nominal',
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inventoryItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `missions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(32) NOT NULL,
	`name` varchar(120) NOT NULL,
	`region` varchar(120) NOT NULL,
	`status` enum('planning','active','complete','paused') NOT NULL DEFAULT 'active',
	`readiness` int NOT NULL DEFAULT 0,
	`crewOnIce` int NOT NULL DEFAULT 0,
	`crewCapacity` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `missions_id` PRIMARY KEY(`id`),
	CONSTRAINT `missions_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `movementLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`missionId` int NOT NULL,
	`assetId` int,
	`teamMemberId` int,
	`title` varchar(160) NOT NULL,
	`detail` text NOT NULL,
	`status` varchar(32) NOT NULL,
	`occurredAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `movementLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`missionId` int NOT NULL,
	`title` varchar(160) NOT NULL,
	`type` enum('route_brief','inventory_snapshot','incident_summary','handover') NOT NULL,
	`status` enum('draft','ready','exported') NOT NULL DEFAULT 'draft',
	`summary` text NOT NULL,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teamMembers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`missionId` int NOT NULL,
	`name` varchar(120) NOT NULL,
	`role` enum('Mission Commander','Logistics & Supply Lead','Route & Navigation Lead','Fleet & Asset Lead','Medical & Safety Officer','Communications & Field Operations Lead') NOT NULL,
	`status` enum('on_ice','checked_in','standby','off_duty') NOT NULL DEFAULT 'standby',
	`callSign` varchar(48),
	`contactChannel` varchar(32),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `teamMembers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `waypoints` (
	`id` int AUTO_INCREMENT NOT NULL,
	`routeId` int NOT NULL,
	`code` varchar(32) NOT NULL,
	`name` varchar(120) NOT NULL,
	`sequence` int NOT NULL DEFAULT 0,
	`latitude` varchar(32),
	`longitude` varchar(32),
	`status` enum('pending','active','complete') NOT NULL DEFAULT 'pending',
	CONSTRAINT `waypoints_id` PRIMARY KEY(`id`)
);
