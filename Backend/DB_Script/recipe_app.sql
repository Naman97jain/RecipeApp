--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2
-- Dumped by pg_dump version 12.2

-- Started on 2021-07-21 16:40:37

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 73249)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 2850 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 205 (class 1259 OID 73278)
-- Name: ingredient; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ingredient (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    recipe_id uuid,
    name text,
    amount bigint
);


ALTER TABLE public.ingredient OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 73270)
-- Name: recipe; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recipe (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    recipe_name text,
    description text,
    imagepath text,
    created_on timestamp without time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.recipe OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 73260)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    created_on timestamp without time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 2717 (class 2606 OID 73285)
-- Name: ingredient ingredient_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient
    ADD CONSTRAINT ingredient_pkey PRIMARY KEY (id);


--
-- TOC entry 2715 (class 2606 OID 73277)
-- Name: recipe recipe_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recipe
    ADD CONSTRAINT recipe_pkey PRIMARY KEY (id);


--
-- TOC entry 2713 (class 2606 OID 73268)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 2718 (class 2606 OID 73286)
-- Name: ingredient ingredient_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ingredient
    ADD CONSTRAINT ingredient_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipe(id) ON DELETE CASCADE;


-- Completed on 2021-07-21 16:40:37

--
-- PostgreSQL database dump complete
--

