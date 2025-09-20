import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mockApi } from '@/data/mockApi'
import { queryKeys } from '@/data/queryKeys'
import { MemberProfileUpdate, ProfileUpdateResponse } from '@/types/api'

export function useMemberProfile() {
  return useQuery({
    queryKey: queryKeys.member,
    queryFn: () => mockApi.fetchMemberProfile(),
  })
}

// Mock API function for updating profile
const updateMemberProfile = async (updates: MemberProfileUpdate): Promise<ProfileUpdateResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // In real app, this would be:
  // const response = await fetch('/api/ver3/customers/{customerId}', {
  //   method: 'PUT',
  //   headers: {
  //     'Authorization': `Bearer ${accessToken}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(updates),
  // })
  // return response.json()

  // Mock successful update
  const currentProfile = mockApi.getCurrentProfile()
  const updatedProfile = {
    ...currentProfile,
    ...updates,
    emergencyContact: updates.emergencyContact || currentProfile.emergencyContact,
    preferences: updates.preferences || currentProfile.preferences,
  }

  // Update mock data
  mockApi.updateProfile(updatedProfile)

  return {
    member: updatedProfile,
    message: 'Profile updated successfully'
  }
}

export function useMemberProfileUpdate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateMemberProfile,
    onSuccess: (data) => {
      // Update the cached profile data
      queryClient.setQueryData(queryKeys.member, data.member)
      
      // Optionally invalidate to refetch from server
      queryClient.invalidateQueries({ queryKey: queryKeys.member })
    },
    onError: (error) => {
      console.error('Failed to update profile:', error)
    }
  })
}
