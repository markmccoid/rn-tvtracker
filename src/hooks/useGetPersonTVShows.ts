import { useState, useEffect } from "react";
import { tvGetPersonCredits } from "@markmccoid/tmdb_api";
import { useOState, useOActions } from "../store/overmind";
import _ from "lodash";
import { CastTVShows } from "@markmccoid/tmdb_api";

type CastTVShowPlusID = CastTVShows & {
  id: number;
};
export const useGetPersonTVShows = (personId): [CastTVShowPlusID[], boolean] => {
  const [personTVShowData, setPersonTVShowData] = useState<CastTVShowPlusID[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const state = useOState();
  const actions = useOActions();

  const getPersonTVShows = async () => {
    setIsLoading(true);
    if (!personId) {
      setPersonTVShowData([]);
      setIsLoading(false);
      return;
    }
    const result = await tvGetPersonCredits(personId);

    // the results are not tagged (showing if a tvShow is already in your saved tvShows list)
    // tag first and then send back
    // This dataset returns the id as tvShowId, however the tagOthertvShowResults needs the tvShow id
    // to be stored in a property called id.  That is what we are doing here:
    const preppedForTagging = _.uniqBy(
      result.data.cast.map((item) => ({ ...item, id: item.tvShowId })),
      "id"
    );
    const taggedResults = actions.oSearch.tagOtherTVShowResults(preppedForTagging);
    setPersonTVShowData(_.reverse(_.sortBy(taggedResults, [(el) => el?.firstAirDate?.epoch])));
    setIsLoading(false);
  };
  useEffect(() => {
    getPersonTVShows();
  }, [personId, state.oSaved.savedTVShows.length]);
  // Not using nextPage, prevPage, but could change recommendedData state to be an object and then separate when returning
  // return [recommendedData.data, recommendedData.nextPage, recommendedData.prevPage, isLoading]
  return [personTVShowData, isLoading];
};
