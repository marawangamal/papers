DROP FUNCTION IF EXISTS query_embeddings(vector,double precision);
CREATE OR REPLACE FUNCTION public.query_embeddings(embedding vector, match_threshold double precision)
 RETURNS SETOF vw_final_papers
 LANGUAGE plpgsql
AS $function$
begin
  return query
  select *
  from vw_final_papers

  -- The inner product is negative, so we negate match_threshold
  where abstract_embedding <#> embedding < -match_threshold

  -- Our embeddings are normalized to length 1, so cosine similarity
  -- and inner product will produce the same query results.
  -- Using inner product which can be computed faster.
  --
  -- For the different distance functions, see https://github.com/pgvector/pgvector
  order by abstract_embedding <#> embedding;
end;
$function$
;
;