SELECT *
FROM public.account
WHERE account_id = 1;


SELECT *
FROM PUBLIC.inventory
WHERE inv_id = 10;

SELECT *
FROM public.classification
WHERE classification_id = 3;

UPDATE public.account
SET account_lastname = 'Lopez'
WHERE account_id = 1;

UPDATE PUBLIC.inventory
SET inv_price = 35000
WHERE inv_id = 10;

UPDATE public.classification
SET classification_name = 'Sports'
WHERE classification_id = 2;

DELETE FROM public.account
WHERE account_id = 5;

DELETE FROM PUBLIC.inventory
WHERE inv_id = 12;

DELETE FROM public.classification
WHERE classification_id = 6;


/* add tony stark */
INSERT INTO public.account (
  account_firstname,
  account_lastname,
  account_email,
  account_password
)
VALUES (
  'Tony',
  'Stark',
  'tony@starkent.com',
  'Iam1ronM@n'
);

/*update*/
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

/*delete*/
DELETE FROM public.account
WHERE account_id = 1;

/* 5 */
SELECT 
    i.inv_make,
    i.inv_model,
    c.classification_name
FROM public.inventory i
INNER JOIN public.classification c
    ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';