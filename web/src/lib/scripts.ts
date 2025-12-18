  // Format Date
  export const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  export const filternotelpon = (value: string) => {
    return value.replace(/[^0-9]/g, "");
  };