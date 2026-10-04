/**
 * BAZAR360 Enterprise Test Fixtures & Mock Data Schemas
 * 
 * This module preserves typed mock data schemas and test fixture factories 
 * for unit testing, integration tests, and sandbox development without polluting
 * the live production Firestore database.
 */

import { CarListing, Dealer } from '../types';
import { UserProfile } from '../lib/dbService';

/**
 * Standard CarListing Schema Specification for Development & Testing
 */
export interface MockCarListingSchema {
  id: string;
  title: string;
  make: string;
  model: string;
  variant?: string;
  vehicleType?: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
  transmission: 'Automatic' | 'Manual';
  imageUrl: string;
  primaryImage?: string;
  images: string[];
  condition: 'New' | 'Used';
  engineCC: number;
  exteriorColor: string;
  bodyCondition: 'Total Genuine' | 'Minor Touch-ups' | 'Major Repaint';
  registrationCity: string;
  documentType: 'Smart Card' | 'Original Book' | 'Duplicate';
  tokenTaxPaid: boolean;
  tokenTaxStatus?: string;
  assemblyType?: string;
  dealerId: string;
  sellerType?: 'Individual' | 'Showroom';
  sellerName?: string;
  sellerPhone?: string;
  sellerWhatsApp?: string;
  location?: string;
  verified: boolean;
  featured: boolean;
  approved?: boolean;
  description: string;
  tags: string[];
  createdAt: string;
  specs: {
    color: string;
    engineSize: string;
    horspower: string;
    regionalSpecs: string;
  };
}

/**
 * Test Fixture Vehicles for isolated unit tests and visual regressions
 */
export const TEST_FIXTURE_LISTINGS: CarListing[] = [
  {
    id: 'fixture-test-sedan-2024',
    title: 'Test Benchmark Sedan 1.8 Elegance',
    make: 'Honda',
    model: 'Civic',
    variant: '1.8 i-VTEC',
    vehicleType: 'Sedans',
    year: 2024,
    price: 8500000,
    mileage: 12000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
    primaryImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80'],
    verified: true,
    featured: false,
    approved: true,
    condition: 'Used',
    engineCC: 1800,
    exteriorColor: 'Taffeta White',
    bodyCondition: 'Total Genuine',
    registrationCity: 'Islamabad',
    documentType: 'Smart Card',
    tokenTaxPaid: true,
    tokenTaxStatus: 'Paid',
    assemblyType: 'Local',
    dealerId: 'test-fixture-dealer',
    sellerType: 'Showroom',
    sellerName: 'Benchmark Showroom',
    sellerPhone: '+923000000000',
    sellerWhatsApp: '923000000000',
    location: 'Islamabad, Pakistan',
    createdAt: '2026-01-01T00:00:00.000Z',
    description: 'Sandbox test fixture listing for automated test pipelines.',
    tags: ['Test', 'Sedan', 'Benchmark'],
    specs: {
      color: 'White',
      engineSize: '1.8L',
      horspower: '141 hp',
      regionalSpecs: 'Pakistani',
    },
    status: 'Available',
  },
  {
    id: 'fixture-test-suv-2024',
    title: 'Test Benchmark SUV 4x4 Sigma',
    make: 'Toyota',
    model: 'Fortuner',
    variant: '2.8 Sigma 4',
    vehicleType: 'SUVs',
    year: 2024,
    price: 19500000,
    mileage: 8000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    primaryImage: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80'],
    verified: true,
    featured: true,
    approved: true,
    condition: 'Used',
    engineCC: 2800,
    exteriorColor: 'Attitude Black',
    bodyCondition: 'Total Genuine',
    registrationCity: 'Lahore',
    documentType: 'Smart Card',
    tokenTaxPaid: true,
    tokenTaxStatus: 'Paid',
    assemblyType: 'Local',
    dealerId: 'test-fixture-dealer',
    sellerType: 'Showroom',
    sellerName: 'Benchmark Showroom',
    sellerPhone: '+923000000000',
    sellerWhatsApp: '923000000000',
    location: 'Lahore, Pakistan',
    createdAt: '2026-01-01T00:00:00.000Z',
    description: 'Sandbox test fixture listing for automated test pipelines.',
    tags: ['Test', 'SUV', 'Diesel'],
    specs: {
      color: 'Black',
      engineSize: '2.8L',
      horspower: '201 hp',
      regionalSpecs: 'Pakistani',
    },
    status: 'Available',
  }
];

/**
 * Test Fixture Dealer Schema
 */
export const TEST_FIXTURE_DEALER: Dealer = {
  id: 'fixture-test-dealer',
  name: 'Benchmark Showroom Fixture',
  subtitle: 'Development and Testing Benchmark Showroom',
  location: 'Peshawar, Pakistan',
  rating: 5.0,
  vehiclesCount: 2,
  followersCount: '100',
  avatarLetter: 'BS',
  avatarUrl: '',
  logo: '',
  logoUrl: '',
  coverImage: '',
  phone: '+923000000000',
  whatsapp: '923000000000',
  description: 'Fixture showroom representation for unit tests.',
  socials: {},
  smartSlug: 'BenchmarkTest',
  passkey: 'Test360',
  activityFeed: [],
};

/**
 * Test Fixture User Profile Schema
 */
export const TEST_FIXTURE_USER: UserProfile = {
  uid: 'fixture-test-user-uid',
  email: 'tester@bazar360.local',
  displayName: 'Quality Assurance Tester',
  role: 'Individual User',
  status: 'Active',
  city: 'Peshawar',
  phoneNumber: '+923000000000',
  createdAt: '2026-01-01T00:00:00.000Z',
  lastLogin: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

/**
 * Helper to generate isolated mock car listings in tests
 */
export function createMockCarListing(overrides: Partial<CarListing> = {}): CarListing {
  return {
    id: `mock-car-${Date.now()}`,
    title: 'Mock Vehicle',
    make: 'Toyota',
    model: 'Corolla',
    vehicleType: 'Sedans',
    year: 2023,
    price: 6500000,
    mileage: 25000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    imageUrl: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80',
    images: [],
    condition: 'Used',
    status: 'Available',
    approved: true,
    verified: false,
    featured: false,
    dealerId: 'mock-dealer',
    description: 'Mock car listing description',
    tags: ['Mock'],
    engineCC: 1800,
    exteriorColor: 'White',
    bodyCondition: 'Total Genuine',
    registrationCity: 'Islamabad',
    documentType: 'Smart Card',
    tokenTaxPaid: true,
    createdAt: new Date().toISOString(),
    specs: {
      color: 'White',
      engineSize: '1.8L',
      horspower: '140 hp',
      regionalSpecs: 'Pakistani',
    },
    ...overrides,
  };
}
