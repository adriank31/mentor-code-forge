-- Grant pro access to hobertshaw6@gmail.com
UPDATE profiles 
SET 
  is_pro = true,
  subscription_end = '2099-12-31 23:59:59+00'
WHERE email = 'hobertshaw6@gmail.com';