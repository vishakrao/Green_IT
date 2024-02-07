module Helpers exposing (..)

import Dict exposing (Dict)
import Publicodes as P


resultNamespace : P.RuleName
resultNamespace =
    "resultats"


totalRuleName : P.RuleName
totalRuleName =
    "resultats . bilan total"


getQuestions : P.RawRules -> List String -> Dict String (List P.RuleName)
getQuestions rules categories =
    Dict.toList rules
        |> List.filterMap
            (\( name, rule ) ->
                Maybe.map (\_ -> name) rule.question
            )
        |> List.foldl
            (\name dict ->
                let
                    category =
                        P.namespace name
                in
                if List.member category categories then
                    Dict.update category
                        (\maybeList ->
                            case maybeList of
                                Just list ->
                                    Just (name :: list)

                                Nothing ->
                                    Just [ name ]
                        )
                        dict

                else
                    dict
            )
            Dict.empty


{-| NOTE: Could be dynamic, but for now we just hardcode the categories.
-}
getCategories : P.RawRules -> List String
getCategories _ =
    [ "informations"
    , "alimentation"
    , "transport"
    , "infrastructures"
    , "hébergement"
    , "énergie"
    , "communication"
    ]


isInCategory : P.RuleName -> P.RuleName -> Bool
isInCategory category ruleName =
    P.splitRuleName ruleName
        |> List.head
        |> Maybe.withDefault ""
        |> (\namespace -> namespace == category)