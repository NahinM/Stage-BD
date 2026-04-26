import { Link, useParams } from "react-router-dom";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  addArtistWork,
  fetchArtistDetails,
  followArtist,
  saveArtistProfile,
  updateArtistWork,
  type ArtistDetail,
  type WorkItem,
} from "../data/artist-api";

type WorkForm = {
  title: string;
  category: string;
  media_url: string;
};

export default function ArtistDetails() {
  const { id } = useParams();
  const username = id || "";

  const [artist, setArtist] = useState<ArtistDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [addingWork, setAddingWork] = useState(false);
  const [editingWork, setEditingWork] = useState<WorkItem | null>(null);
  const [savingEditWork, setSavingEditWork] = useState(false);

  const [profileForm, setProfileForm] = useState({
    bio: "",
    genres: "",
    instagram: "",
    portfolio: "",
  });

  const [newWork, setNewWork] = useState<WorkForm>({
    title: "",
    category: "Illustration",
    media_url: "",
  });

  const [editWorkForm, setEditWorkForm] = useState<WorkForm>({
    title: "",
    category: "Illustration",
    media_url: "",
  });

  let loggedInUser: { username?: string; role?: string } | null = null;
  try {
    loggedInUser = JSON.parse(
      localStorage.getItem("loggedInUser") ||
        localStorage.getItem("user") ||
        "null"
    );
  } catch {
    loggedInUser = null;
  }

  const canManageProfile =
    !!loggedInUser && loggedInUser.username === username;

  const loadArtist = async () => {
    try {
      const data = await fetchArtistDetails(username);
      setArtist(data);
      setProfileForm({
        bio: data.bio || "",
        genres: data.genres || "",
        instagram: data.socialLinks?.instagram || "",
        portfolio: data.socialLinks?.portfolio || "",
      });
    } catch (error) {
      console.error("Failed to load artist details:", error);
      setArtist(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      loadArtist();
    }
  }, [username]);

  const handleProfileChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleWorkChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewWork((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditWorkChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditWorkForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!artist) return;

    try {
      setSavingProfile(true);
      await saveArtistProfile({
        username: artist.username,
        bio: profileForm.bio,
        genres: profileForm.genres,
        social_links: {
          instagram: profileForm.instagram,
          portfolio: profileForm.portfolio,
        },
      });
      await loadArtist();
      alert("Profile updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddWork = async (e: FormEvent) => {
    e.preventDefault();
    if (!artist) return;

    if (
      !newWork.title.trim() ||
      !newWork.category.trim() ||
      !newWork.media_url.trim()
    ) {
      alert("Please fill in all work fields.");
      return;
    }

    try {
      setAddingWork(true);
      await addArtistWork({
        username: artist.username,
        title: newWork.title,
        category: newWork.category,
        media_url: newWork.media_url,
      });

      setNewWork({
        title: "",
        category: "Illustration",
        media_url: "",
      });

      await loadArtist();
      alert("Work added successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to add work.");
    } finally {
      setAddingWork(false);
    }
  };

  const openEditWorkModal = (work: WorkItem) => {
    setEditingWork(work);
    setEditWorkForm({
      title: work.title,
      category: work.category,
      media_url: work.link,
    });
  };

  const closeEditWorkModal = () => {
    setEditingWork(null);
    setEditWorkForm({
      title: "",
      category: "Illustration",
      media_url: "",
    });
    setSavingEditWork(false);
  };

  const handleUpdateWork = async (e: FormEvent) => {
    e.preventDefault();
    if (!artist || !editingWork) return;

    if (
      !editWorkForm.title.trim() ||
      !editWorkForm.category.trim() ||
      !editWorkForm.media_url.trim()
    ) {
      alert("Please fill in all edit work fields.");
      return;
    }

    try {
      setSavingEditWork(true);

      await updateArtistWork(editingWork.id, {
        username: artist.username,
        title: editWorkForm.title,
        category: editWorkForm.category,
        media_url: editWorkForm.media_url,
      });

      await loadArtist();
      closeEditWorkModal();
      alert("Work updated successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to update work.");
    } finally {
      setSavingEditWork(false);
    }
  };

  const handleFollowArtist = async () => {
    if (!loggedInUser?.username || !artist?.username) {
      alert("Please sign in first.");
      return;
    }

    try {
      await followArtist({
        follower_username: loggedInUser.username,
        followed_username: artist.username,
      });
      alert("Follow request completed.");
    } catch (error) {
      console.error(error);
      alert("Failed to follow artist.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading artist...
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Artist not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden">
        <img
          src={artist.image}
          alt={artist.name}
          className="w-full h-80 object-cover"
        />

        <div className="p-8">
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/artists" className="text-blue-600 underline">
              ← Back to Artists
            </Link>
            <Link to="/showcase" className="text-blue-600 underline">
              View Digital Art Showcase
            </Link>
            {!canManageProfile && (
              <button
                onClick={handleFollowArtist}
                className="bg-black text-white px-4 py-2 rounded-lg"
              >
                Follow Artist
              </button>
            )}
          </div>

          <h1 className="text-4xl font-bold mt-4">{artist.name}</h1>
          <p className="text-lg text-gray-600 mt-2">
            {artist.category} • {artist.city}
          </p>

          <p className="mt-6 text-gray-700 leading-8">{artist.bio}</p>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-2">
              Genres / Specialization
            </h2>
            <p className="text-gray-700">
              {artist.genres || "No genres added yet."}
            </p>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-2">Profile Links</h2>
            <div className="flex flex-wrap gap-4">
              {artist.socialLinks?.instagram && (
                <a
                  href={artist.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Instagram
                </a>
              )}
              {artist.socialLinks?.portfolio && (
                <a
                  href={artist.socialLinks.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Portfolio
                </a>
              )}
              {artist.socialLinks?.youtube && (
                <a
                  href={artist.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  YouTube
                </a>
              )}
            </div>
          </div>

          {canManageProfile && (
            <>
              <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
                <form
                  onSubmit={handleSaveProfile}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl border"
                >
                  <textarea
                    name="bio"
                    value={profileForm.bio}
                    onChange={handleProfileChange}
                    placeholder="Artist Bio"
                    rows={4}
                    className="border rounded-lg px-4 py-2 md:col-span-2"
                  />

                  <input
                    type="text"
                    name="genres"
                    value={profileForm.genres}
                    onChange={handleProfileChange}
                    placeholder="Genres (comma separated)"
                    className="border rounded-lg px-4 py-2 md:col-span-2"
                  />

                  <input
                    type="text"
                    name="instagram"
                    value={profileForm.instagram}
                    onChange={handleProfileChange}
                    placeholder="Instagram link"
                    className="border rounded-lg px-4 py-2"
                  />

                  <input
                    type="text"
                    name="portfolio"
                    value={profileForm.portfolio}
                    onChange={handleProfileChange}
                    placeholder="Portfolio link"
                    className="border rounded-lg px-4 py-2"
                  />

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="bg-black text-white px-5 py-2 rounded-lg hover:opacity-90 md:w-fit"
                  >
                    {savingProfile ? "Saving..." : "Save Profile"}
                  </button>
                </form>
              </div>

              <div className="mt-10">
                <h2 className="text-2xl font-semibold mb-2">Add New Work</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Works added in supported categories will also appear in the
                  Digital Art Showcase.
                </p>

                <form
                  onSubmit={handleAddWork}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl border"
                >
                  <input
                    type="text"
                    name="title"
                    value={newWork.title}
                    onChange={handleWorkChange}
                    placeholder="Work Title"
                    className="border rounded-lg px-4 py-2"
                  />

                  <select
                    name="category"
                    value={newWork.category}
                    onChange={handleWorkChange}
                    className="border rounded-lg px-4 py-2"
                  >
                    <option value="Illustration">Illustration</option>
                    <option value="Digital Art">Digital Art</option>
                    <option value="Poster">Poster</option>
                    <option value="Digital Media">Digital Media</option>
                    <option value="Performance Visual">
                      Performance Visual
                    </option>
                    <option value="Brand Design">Brand Design</option>
                  </select>

                  <input
                    type="text"
                    name="media_url"
                    value={newWork.media_url}
                    onChange={handleWorkChange}
                    placeholder="Media URL (YouTube or image URL)"
                    className="border rounded-lg px-4 py-2 md:col-span-2"
                  />

                  <button
                    type="submit"
                    disabled={addingWork}
                    className="bg-black text-white px-5 py-2 rounded-lg hover:opacity-90 md:w-fit"
                  >
                    {addingWork ? "Adding..." : "Add Work"}
                  </button>
                </form>
              </div>
            </>
          )}

          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Featured Works</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {artist.works.map((work) => (
                <div
                  key={work.id}
                  className="border rounded-xl p-5 shadow-sm hover:shadow-md transition bg-white"
                >
                  <img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-block text-xs bg-gray-100 px-3 py-1 rounded-full">
                      {work.type}
                    </span>
                    <span className="inline-block text-xs bg-gray-100 px-3 py-1 rounded-full">
                      {work.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold">{work.title}</h3>
                  <p className="text-gray-600 mt-2 text-sm leading-6">
                    {work.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-4 items-center">
                    <a
                      href={work.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Open Work
                    </a>

                    {canManageProfile && (
                      <button
                        onClick={() => openEditWorkModal(work)}
                        className="text-sm bg-black text-white px-3 py-1 rounded-lg"
                      >
                        Edit Work
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {editingWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Edit Work
            </h2>
            <p className="mb-6 text-sm text-gray-600">
              Update your portfolio work details.
            </p>

            <form onSubmit={handleUpdateWork} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-800">
                  Work Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editWorkForm.title}
                  onChange={handleEditWorkChange}
                  className="w-full rounded-xl border px-4 py-2 text-sm outline-none"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-800">
                  Category
                </label>
                <select
                  name="category"
                  value={editWorkForm.category}
                  onChange={handleEditWorkChange}
                  className="w-full rounded-xl border px-4 py-2 text-sm outline-none"
                >
                  <option value="Illustration">Illustration</option>
                  <option value="Digital Art">Digital Art</option>
                  <option value="Poster">Poster</option>
                  <option value="Digital Media">Digital Media</option>
                  <option value="Performance Visual">
                    Performance Visual
                  </option>
                  <option value="Brand Design">Brand Design</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-800">
                  Media URL
                </label>
                <input
                  type="text"
                  name="media_url"
                  value={editWorkForm.media_url}
                  onChange={handleEditWorkChange}
                  className="w-full rounded-xl border px-4 py-2 text-sm outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditWorkModal}
                  className="rounded-xl border px-4 py-2 text-sm font-medium text-gray-700"
                  disabled={savingEditWork}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                  disabled={savingEditWork}
                >
                  {savingEditWork ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}