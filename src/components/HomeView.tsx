import React, { useState, useEffect } from 'react';
import { CarListing, Dealer } from '../types';
import { HomeFeed } from './HomeFeed';
import { db } from '../firebase';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';
import { dbFetchListings } from '../lib/dbService';

interface HomeViewProps {
  dealers: Dealer[];
  listings: CarListing[];
  onSelectDealer: (id: string) => void;
  setTab: (tab: string) => void;
  currentUser?: any;
  lang: 'en' | 'ur';
  onSelectListing: (car: CarListing) => void;
  onToggleCompare: (car: CarListing) => void;
  compareList: CarListing[];
  onToggleFavorite: (car: CarListing) => void;
  favoritesList: CarListing[];
  recentViewsList?: CarListing[];
  dbLoading?: boolean;
  setSelectedCategory?: (category: string) => void;
  setSearchQuery?: (query: string) => void;
}

export default function HomeView(props: HomeViewProps) {
  const [realtimeListings, setRealtimeListings] = useState<CarListing[]>(props.listings || []);

  // Sync with prop listings whenever props.listings updates
  useEffect(() => {
    if (props.listings && props.listings.length > 0) {
      setRealtimeListings(props.listings);
    }
  }, [props.listings]);

  // Initial fetch on mount to guarantee immediate inventory load
  useEffect(() => {
    let isMounted = true;
    dbFetchListings().then(fresh => {
      if (isMounted && fresh && fresh.length > 0) {
        setRealtimeListings(fresh);
      }
    }).catch(err => console.warn('[HomeView] Initial fetch error:', err));
    return () => { isMounted = false; };
  }, []);

  // Establish live real-time connection to Firestore listings collection
  useEffect(() => {
    try {
      const q = query(collection(db, 'listings'), limit(100));
      const unsubscribe = onSnapshot(q, async () => {
        const freshListings = await dbFetchListings(true);
        if (freshListings && freshListings.length > 0) {
          setRealtimeListings(freshListings);
        }
      }, (error) => {
        console.warn('[Firestore Live Sync] Dynamic subscription status:', error.message || error);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn('[Firestore Live Sync] Initial subscription failure:', err);
    }
  }, []);

  return (
    <HomeFeed
      listings={realtimeListings}
      dealers={props.dealers}
      onSelectListing={props.onSelectListing}
      onSelectDealer={props.onSelectDealer}
      onToggleCompare={props.onToggleCompare}
      compareList={props.compareList}
      onToggleFavorite={props.onToggleFavorite}
      favoritesList={props.favoritesList}
      recentViewsList={props.recentViewsList}
      lang={props.lang}
      setTab={props.setTab}
      setSelectedCategory={props.setSelectedCategory}
      setSearchQuery={props.setSearchQuery}
    />
  );
}
