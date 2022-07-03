CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

-- ACCOUNT
CREATE TABLE IF NOT EXISTS account (
  id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  uses_provider boolean DEFAULT FALSE,
  provider_type text, --typeOfLogin
  provider_email text,
  wallet_address text NOT NULL,
  wallet_chain text NOT NULL CHECK (wallet_chain IN ('solana', 'ethereum')),
  wallet_chain_id integer NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT has_details_if_using_provider CHECK (uses_provider IS FALSE OR (provider_type IS NOT NULL AND provider_email IS NOT NULL)),
  CONSTRAINT has_chain_id_if_ethereum CHECK (wallet_chain != 'ethereum' OR wallet_chain_id IS NOT NULL)
);

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON account
  FOR EACH ROW
  EXECUTE PROCEDURE moddatetime (updated_at);

-- ACCOUNT_PROFILE
CREATE TABLE IF NOT EXISTS account_profile (
  id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  account_id uuid REFERENCES account (id) NOT NULL,
  handle varchar(20) UNIQUE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON account_profile
  FOR EACH ROW
  EXECUTE PROCEDURE moddatetime (updated_at);

-- ACCOUNT_FOLLOW_RELATION
CREATE TABLE IF NOT EXISTS account_follow_relation (
  follower uuid REFERENCES account_profile (id),
  followee uuid REFERENCES account_profile (id),
  PRIMARY KEY (follower, followee),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- SUGGESTION
CREATE TABLE IF NOT EXISTS suggestion (
  id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
  account_profile uuid REFERENCES account_profile (id) NOT NULL,
  content text NOT NULL,
  votes_for integer DEFAULT 0 NOT NULL,
  votes_against integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON suggestion
  FOR EACH ROW
  EXECUTE PROCEDURE moddatetime (updated_at);

