-- INSERT VALUES
INSERT INTO public.account(account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- UPDATE  A QUEARY
UPDATE public.account
SET account_type = 'Admin'
WHERE account_firstname = 'Tony';


-- DELETE A QUERY

DELETE FROM public.account
WHERE account_firstname = 'Tony';

-- UPDATE INFO

UPDATE public.inventory
SET inv_description = REPLACE (inv_description,'small interiors','huge interior');

-- INNER JOIN
SELECT inv_make, inv_model, classification.classification_name
FROM inventory
INNER JOIN classification
    ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';

--UPDATE QUERIES

UPDATE inventory
SET 
    inv_image = CONCAT(
        SUBSTRING(inv_image FROM 1 FOR POSITION('images' IN inv_image) + 5), 
        '/vehicles', 
        SUBSTRING(inv_image FROM POSITION('images' IN inv_image) + 6 FOR LENGTH(inv_image))
    ),
    inv_thumbnail = CONCAT(
        SUBSTRING(inv_thumbnail FROM 1 FOR POSITION('images' IN inv_thumbnail) + 5), 
        '/vehicles', 
        SUBSTRING(inv_thumbnail FROM POSITION('images' IN inv_thumbnail) + 6 FOR LENGTH(inv_thumbnail))
    );